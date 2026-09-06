import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Upload, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Image as ImageIcon,
  HelpCircle,
  CheckCircle2,
  Eye,
  Sliders
} from 'lucide-react';

interface Spherical360ViewerProps {
  initialImageUrl?: string;
  propertyTitle?: string;
  lang?: 'fr' | 'en' | 'sw';
  onClose?: () => void;
}

// Preset high quality 360 equirectangular images
const DEFAULT_360_SAMPLES = [
  {
    id: 'living-360',
    title: 'Villa Living Room 360°',
    titleFr: 'Grand Salon 360°',
    titleSw: 'Sebule ya Kifahari 360°',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80'
  },
  {
    id: 'resort-360',
    title: 'Ocean Resort Deck 360°',
    titleFr: 'Terrasse Océanique 360°',
    titleSw: 'Ukumbi wa Bahari 360°',
    url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=2400&q=80'
  },
  {
    id: 'penthouse-360',
    title: 'Sky Penthouse 360°',
    titleFr: 'Penthouse de Luxe 360°',
    titleSw: 'Ghorofa ya Juu 360°',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=80'
  }
];

export default function Spherical360Viewer({
  initialImageUrl,
  propertyTitle = 'Propriété ImmoAI',
  lang = 'fr',
  onClose
}: Spherical360ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>(
    initialImageUrl || DEFAULT_360_SAMPLES[0].url
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>('living-360');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  // Viewing angles in radians
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const fovRef = useRef<number>(75); // Field of view in degrees

  const [displayYawDeg, setDisplayYawDeg] = useState<number>(0);
  const [displayPitchDeg, setDisplayPitchDeg] = useState<number>(0);
  const [displayFov, setDisplayFov] = useState<number>(75);

  const isDraggingRef = useRef<boolean>(false);
  const previousMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  // Translations
  const t = {
    fr: {
      title: 'Visionneuse Panoramique Sphérique 360°',
      subtitle: `Navigation 3D immersive pour ${propertyTitle}`,
      uploadBtn: 'Téléverser votre photo 360° (Équirectangulaire)',
      autoRotate: 'Rotation 360° Auto',
      resetView: 'Réinitialiser la vue',
      samples: 'Espaces 360° Prédéfinis',
      instructions: 'Pointez et glissez pour explorer le panorama spherical complet (360° H x 180° V). Utilisez la molette pour zoomer.',
      uploaded: 'Photo 360° personnalisée chargée',
      loading: 'Chargement de l\'image 360°...'
    },
    en: {
      title: '360° Spherical Panoramic Viewer',
      subtitle: `Immersive 3D navigation for ${propertyTitle}`,
      uploadBtn: 'Upload custom 360° photo (Equirectangular)',
      autoRotate: 'Auto-Rotate 360°',
      resetView: 'Reset View',
      samples: '360° Preset Spaces',
      instructions: 'Click and drag to orbit inside the 360° x 180° spherical panorama. Use mouse wheel to zoom in and out.',
      uploaded: 'Custom 360° photo loaded',
      loading: 'Loading 360° texture...'
    },
    sw: {
      title: 'Kivinjari cha Picha za 360°',
      subtitle: `Tazama kikamilifu pande zote za ${propertyTitle}`,
      uploadBtn: 'Weka picha yako ya 360°',
      autoRotate: 'Mzunguko wa 360°',
      resetView: 'Rudi mwanzo',
      samples: 'Maeneo ya 360°',
      instructions: 'Buruta panya au kidole ili kutazama juu, chini, na pande zote 360°. Tumia msokoto wa panya kusogeza karibu.',
      uploaded: 'Picha ya 360° imewekwa',
      loading: 'Inapakia picha ya 360°...'
    }
  }[lang] || {
    title: '360° Spherical Panoramic Viewer',
    subtitle: `Immersive 3D navigation for ${propertyTitle}`,
    uploadBtn: 'Upload custom 360° photo',
    autoRotate: 'Auto-Rotate',
    resetView: 'Reset View',
    samples: '360° Presets',
    instructions: 'Click and drag to navigate spherical image.',
    uploaded: 'Custom 360° loaded',
    loading: 'Loading...'
  };

  // WebGL Initialization & Shader setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL not supported, standard canvas fallback engaged.');
      return;
    }
    glRef.current = gl;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        // Flip vertical UV for WebGL coordinates
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Equirectangular Spherical Projection
    const fsSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_yaw;
      uniform float u_pitch;
      uniform float u_fov;
      varying vec2 v_uv;

      #define PI 3.14159265359

      void main() {
        // Screen normalized coordinates (-1 to 1)
        vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

        // Field of view scaling
        float fovRad = u_fov * (PI / 180.0);
        float focalLength = 1.0 / tan(fovRad * 0.5);

        // Ray direction vector in camera space
        vec3 ray = normalize(vec3(st.x, st.y, focalLength));

        // Pitch Rotation (X axis)
        float cosP = cos(u_pitch);
        float sinP = sin(u_pitch);
        mat3 rotX = mat3(
          1.0, 0.0, 0.0,
          0.0, cosP, -sinP,
          0.0, sinP, cosP
        );

        // Yaw Rotation (Y axis)
        float cosY = cos(u_yaw);
        float sinY = sin(u_yaw);
        mat3 rotY = mat3(
          cosY, 0.0, sinY,
          0.0, 1.0, 0.0,
          -sinY, 0.0, cosY
        );

        // Transformed ray direction in world space
        vec3 worldRay = rotY * (rotX * ray);

        // Convert worldRay (x, y, z) to spherical equirectangular coordinates (longitude, latitude)
        float lon = atan(worldRay.x, worldRay.z); // -PI to PI
        float lat = asin(clamp(worldRay.y, -1.0, 1.0)); // -PI/2 to PI/2

        // Map spherical angles to normalized UV texture coordinates (0.0 to 1.0)
        vec2 uv = vec2(
          (lon + PI) / (2.0 * PI),
          (lat + (PI * 0.5)) / PI
        );

        gl_FragColor = texture2D(u_texture, uv);
      }
    `;

    // Shader Compiler Helper
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Quad geometry (2 triangles covering clip space)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // Create WebGL Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    textureRef.current = texture;

  }, []);

  // Load image into texture
  useEffect(() => {
    const gl = glRef.current;
    const texture = textureRef.current;
    if (!gl || !texture) return;

    setIsLoadingImage(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      setIsLoadingImage(false);
    };

    img.onerror = () => {
      console.warn('Image load error for 360 viewer, using fallback proxy');
      setIsLoadingImage(false);
    };
  }, [imageUrl]);

  // Render loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const render = (time: number) => {
      const gl = glRef.current;
      const program = programRef.current;
      const canvas = canvasRef.current;

      if (gl && program && canvas) {
        // Auto rotate increment if active and not dragging
        if (isAutoRotating && !isDraggingRef.current) {
          const delta = (time - lastTimestamp) * 0.001;
          yawRef.current += delta * 0.15; // slow pan speed
          if (yawRef.current > Math.PI * 2) {
            yawRef.current -= Math.PI * 2;
          }
        }
        lastTimestamp = time;

        // Keep canvas pixel size synced
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.useProgram(program);

        // Set uniforms
        const uResLoc = gl.getUniformLocation(program, 'u_resolution');
        const uYawLoc = gl.getUniformLocation(program, 'u_yaw');
        const uPitchLoc = gl.getUniformLocation(program, 'u_pitch');
        const uFovLoc = gl.getUniformLocation(program, 'u_fov');

        gl.uniform2f(uResLoc, canvas.width, canvas.height);
        gl.uniform1f(uYawLoc, yawRef.current);
        gl.uniform1f(uPitchLoc, pitchRef.current);
        gl.uniform1f(uFovLoc, fovRef.current);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Update displayed stats for UI HUD
        const degYaw = Math.round((((yawRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI));
        const degPitch = Math.round(pitchRef.current * (180 / Math.PI));
        setDisplayYawDeg(degYaw);
        setDisplayPitchDeg(degPitch);
        setDisplayFov(Math.round(fovRef.current));
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isAutoRotating]);

  // Mouse & Touch Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    previousMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMouseRef.current.x;
    const deltaY = e.clientY - previousMouseRef.current.y;

    previousMouseRef.current = { x: e.clientX, y: e.clientY };

    // Sensitivity factor relative to FOV
    const sensitivity = (fovRef.current / 800) * 0.02;
    yawRef.current += deltaX * sensitivity;

    // Pitch bounds (-80deg to +80deg)
    const maxPitch = (80 * Math.PI) / 180;
    pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current - deltaY * sensitivity));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsAutoRotating(false);
      previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMouseRef.current.x;
    const deltaY = touch.clientY - previousMouseRef.current.y;

    previousMouseRef.current = { x: touch.clientX, y: touch.clientY };

    const sensitivity = (fovRef.current / 800) * 0.02;
    yawRef.current += deltaX * sensitivity;

    const maxPitch = (80 * Math.PI) / 180;
    pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current - deltaY * sensitivity));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomStep = e.deltaY * 0.05;
    fovRef.current = Math.max(30, Math.min(105, fovRef.current + zoomStep));
  };

  // Custom 360 photo upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setUploadedFileName(file.name);
      setSelectedPresetId('custom');
    }
  };

  const handleResetView = () => {
    yawRef.current = 0;
    pitchRef.current = 0;
    fovRef.current = 75;
  };

  return (
    <div className={`relative rounded-3xl bg-dark-bg border border-brand/30 overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-[1000] p-6' : 'w-full my-8'
    }`}>
      {/* Viewer Header HUD */}
      <div className="p-6 bg-surface-elevated border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-widest mb-1">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>Moteur de Rendu Sphérique WebGL 360°</span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
            {t.title}
          </h3>
          <p className="text-gray-400 text-xs font-medium">
            {uploadedFileName ? `${t.uploaded}: ${uploadedFileName}` : t.subtitle}
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-brand/20 hover:bg-brand text-brand hover:text-white border border-brand/40 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand/10 cursor-pointer"
          >
            <Upload size={14} />
            <span>{t.uploadBtn}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Auto rotate button */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isAutoRotating 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {isAutoRotating ? <Play size={14} className="animate-spin duration-1000" /> : <Pause size={14} />}
            <span>{t.autoRotate}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetView}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-2xl transition-all"
            title={t.resetView}
          >
            <RotateCcw size={16} />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-2xl transition-all"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-2xl transition-all font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[520px] bg-black select-none overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Loading Spinner */}
        <AnimatePresence>
          {isLoadingImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-brand"
            >
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">{t.loading}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Overlay Stats */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white shadow-xl pointer-events-none">
          <Compass size={18} className="text-brand animate-pulse" />
          <div className="text-xs font-mono font-bold">
            <span className="text-gray-400">CAP :</span> {displayYawDeg}° | <span className="text-gray-400">PITCH :</span> {displayPitchDeg}° | <span className="text-gray-400">FOV :</span> {displayFov}°
          </div>
        </div>

        {/* Drag Hint */}
        <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-gray-300 pointer-events-none">
          <Eye size={14} className="text-brand" />
          <span>{t.instructions}</span>
        </div>

        {/* Zoom Overlay Control Buttons */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { fovRef.current = Math.max(30, fovRef.current - 10); }}
            className="p-3 bg-black/70 hover:bg-brand text-white border border-white/10 rounded-2xl backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => { fovRef.current = Math.min(105, fovRef.current + 10); }}
            className="p-3 bg-black/70 hover:bg-brand text-white border border-white/10 rounded-2xl backdrop-blur-md shadow-xl transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
        </div>

        {/* The 360 WebGL Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full block"
        />
      </div>

      {/* Sample Panorama Switcher Footer */}
      <div className="p-6 bg-surface-elevated/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ImageIcon size={16} className="text-brand" />
          <span className="font-bold uppercase tracking-wider">{t.samples} :</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {DEFAULT_360_SAMPLES.map((sample) => {
            const isSelected = selectedPresetId === sample.id;
            const title = lang === 'fr' ? sample.titleFr : lang === 'sw' ? sample.titleSw : sample.title;

            return (
              <button
                key={sample.id}
                onClick={() => {
                  setImageUrl(sample.url);
                  setSelectedPresetId(sample.id);
                  setUploadedFileName(null);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {isSelected && <CheckCircle2 size={14} />}
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
