# Security Specification: ImmoAI Africa

## 1. Data Invariants
- A property listing must have a valid title, location, and numeric price.
- `beds`, `baths`, and `sqm` must be positive numbers.
- `ownerId` must match the UID of the user who created the document.
- `createdAt` must be set to the server timestamp at creation.
- Only the owner of a property can modify or delete it.
- A user can only access and modify their own profile data.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempt to create a property with an `ownerId` of another user.
2. **Missing Fields**: Create a property without the `required` fields (e.g., missing `price`).
3. **Invalid Types**: Update `priceNumeric` with a string instead of a number.
4. **Out of Range**: Set `beds` to -5.
5. **Data Poisoning**: Inject a 1MB string into the `title` field.
6. **Immutable Field Attack**: Try to change the `ownerId` of an existing property.
7. **Temporal Attack**: Set `createdAt` to a date in the past instead of `request.time`.
8. **Privilege Escalation**: Attempt to update a property without being the owner.
9. **PII Leak**: Try to read another user's profile information.
10. **Shadow Field Injection**: Create a property with an extra `isVerified: true` field not in the schema.
11. **ID Poisoning**: Use a 2KB junk string as a document ID.
12. **Blanket Read Attack**: Attempt to list all users in the system.

## 3. Test Runner
(See `firestore.rules.test.ts` for implementation)
