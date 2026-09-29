# CTF Security & Anti-Cheat Architecture

**IDS Learning Lab — Educational Security Model**  
*Classification:* Technical Security Specification & Threat Model

---

## 1. Threat Model & Scope

In an educational cybersecurity platform, the validation architecture balances **offline classroom usability** with **anti-cheat defense**. Students often have access to browser Developer Tools (F12), DOM inspectors, and local storage.

### Security Posture Matrix

| Threat Vector | Client Sandbox Defense | Production Requirement |
|---|---|---|
| **DOM Inspection (Ctrl+F / Elements)** | Flags are **never** rendered into visible or hidden DOM text (`<div hidden>`, attributes, data-*). | Evaluated server-side in memory; flags never transmitted to student browser. |
| **Global Window Leaks** | No global variables (`window.correctFlag`, `window.flagList`). | No client-side exposure. |
| **Console Logging** | Zero `console.log()` statements outputting flag strings. | Centralized server-side audit logs only. |
| **Error Feedback Leakage** | Validator returns generic guidance; never outputs `"Expected: FLAG{...}"`. | Obfuscated timing-safe string comparison. |
| **Brute Force Guessing** | Enforced attempt limiter (`maxAttempts: 5`). Remaining attempts tracked in store. | Rate limiting per IP and user session with exponential backoff. |
| **XP Farming** | Store tracks `completedChallenges` array. XP awarded strictly on first success. | Server-authoritative atomic XP transactions with database constraints. |
| **Prerequisite Bypassing** | Flag submission requires guided investigation questions to be answered. | Backend state machine enforcing prerequisites before flag endpoint acceptance. |

---

## 2. Local vs. Production Adapter Pattern

The platform implements the **Adapter Pattern** in `src/modules/ctf/ctfEngine.js`:

```javascript
// Active local adapter for offline development and classroom simulation
export class LocalCtfAdapter {
  validate(userInput, challengeId, options) {
    return validateFlagSubmission(userInput, challengeId, options);
  }
}

// Remote adapter prepared for client-server production deployment
export class RemoteCtfAdapter {
  constructor(endpoint = '/api/v1/ctf/validate-flag') {
    this.endpoint = endpoint;
    this.mode = 'remote_production_required';
  }

  async validate(userInput, challengeId, options) {
    // NOT PRODUCTION READY — BACKEND REQUIRED
    console.warn('[CTF Engine] Remote evaluation requires backend server API.');
    return validateFlagSubmission(userInput, challengeId, options);
  }
}
```

### Production Security Limitation Notice

> [!WARNING]
> **NOT PRODUCTION READY — BACKEND REQUIRED**  
> While the current client-side implementation prevents casual cheating (hidden DOM inspection, window variables, console leakage), true high-stakes competition security **requires an authoritative backend service**.
> 
> In a production deployment:
> 1. Challenge flags MUST NOT be packaged in frontend JavaScript bundles (`dist/assets/*.js`).
> 2. Flag validation MUST occur via `POST /api/v1/ctf/submissions` with server-side bcrypt/Argon2/HMAC hashing.
> 3. State mutations, attempt counters, and XP allocations MUST be committed in a PostgreSQL/Redis ledger.

---

## 3. Flag Validator Security Rules

Implemented in `src/modules/ctf/flagValidator.js`:

1. **Whitespace Trimming**: Strips leading and trailing whitespace prior to evaluation.
2. **Format Rejection**: Rejects malformed strings that do not adhere to `^FLAG\{.+\}$` before evaluation.
3. **Attempt Limiter**: Rejects evaluation if `currentAttempts >= maxAttempts`, returning `lockedOut: true`.
4. **No Leaks on Error**: Incorrect answers always yield safe feedback:
   ```json
   {
     "valid": false,
     "correct": false,
     "attemptsUsed": 3,
     "attemptsRemaining": 2,
     "feedback": "Flag belum tepat. Periksa kembali IOC dan timeline investigasi."
   }
   ```
   Under no circumstances is the expected flag string exposed in `message`, `feedback`, or DOM attributes.
