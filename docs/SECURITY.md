# POLARIS-Ω: Security, RBAC & Data Provenance Specification

## 1. Authentication & Session Security
- **Stateless Bearer JWT:** Cryptographically signed using HMAC-SHA256 with timed expiration.
- **Password Hashing:** Native `bcrypt` algorithm with automated salt generation.
- **Environment Isolation:** Zero hardcoded API keys or master credentials in code.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Permission / Action | PUBLIC | STUDENT | RESEARCHER | REVIEWER | ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|
| Browse Public Repository | ✓ | ✓ | ✓ | ✓ | ✓ |
| Universal Search | ✓ | ✓ | ✓ | ✓ | ✓ |
| Polar Learning Hub & Quizzes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Track Learning Progress | ✗ | ✓ | ✓ | ✓ | ✓ |
| Upload Research Documents | ✗ | ✗ | ✓ | ✓ | ✓ |
| Run Evidence Comparisons | ✓ | ✓ | ✓ | ✓ | ✓ |
| Run Evidence Stress-Tests | ✓ | ✓ | ✓ | ✓ | ✓ |
| Verify / Flag Extracted Claims | ✗ | ✗ | ✗ | ✓ | ✓ |
| Review AI Output | ✗ | ✗ | ✗ | ✓ | ✓ |
| View Cryptographic Audit Logs | ✗ | ✗ | ✗ | ✓ | ✓ |
| User & System Management | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## 3. Cryptographic Provenance & W3C PROV
- **SHA-256 Checksums:** Calculated on raw bytes upon upload, guaranteeing data integrity against tampering.
- **W3C PROV Architecture:** Stores structured JSON-LD provenance graphs mapping entities (`polaris:Document`, `polaris:Claim`), activities (`polaris:Extraction`), and agents (`polaris:Reviewer`).
