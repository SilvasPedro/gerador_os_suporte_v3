# Security Specification: Telecom OS Generator

## 1. Data Invariants
1. `routeNotices`:
   - System/Admin route updates regarding telecom fiber routes, outages, and technician shifts.
   - Anyone can read active route notices so all operators stay informed in real-time.
   - Any authenticated operator can create or update route notices with valid bounded fields.
2. `workOrders`:
   - Generated work order masks saved for audit or quick re-use.
   - Read & write allowed for authenticated users.
   - Strict bounded size constraints on all text inputs to prevent denial of wallet.
3. `operatorProfiles`:
   - Operator custom preferences (operator name, default period, etc.).
   - Keyed by user ID or open for local device state.

## 2. The Dirty Dozen Payloads (Rejection Matrix)
1. Injecting 1MB payload string in `motive` -> PERMISSION_DENIED (boundary check <= 1000 chars).
2. Injecting unknown fields (shadow fields like `isAdmin: true` in workOrders) -> PERMISSION_DENIED.
3. Empty title in route notice -> PERMISSION_DENIED.
4. Setting negative signal beyond telecom dBm range (-100 to 0) -> Validated.
5. Missing required fields in route notice -> PERMISSION_DENIED.
6. Malformed ID containing non-alphanumeric special characters -> PERMISSION_DENIED.
7. Unauthenticated write attempt to routeNotices or workOrders -> PERMISSION_DENIED.
8. Trying to mutate immutable `createdAt` timestamp -> PERMISSION_DENIED.
9. Oversized phone string (> 30 chars) -> PERMISSION_DENIED.
10. Route status with invalid enum -> PERMISSION_DENIED.
11. Excessive logs payload (> 2000 chars) -> PERMISSION_DENIED.
12. Malicious HTML script tag payload in operator name -> Sanitized & string length constrained.
