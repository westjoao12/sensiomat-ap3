<div align="center">
  <table>
    <tr>
      <td align="center" width="150">
        <img src="../imagens/logo.png" alt="SensioMat Logo" width="120" />
      </td>
      <td>
        <h1>SensioMat: IoT Architecture Engine and Materials Physics Heuristic Analysis</h1>
        <p><strong>Integration API and Endpoints</strong></p>
      </td>
    </tr>
  </table>
</div>

This document details the communication interfaces (RESTful API) provided by SensioMat's `Backend`. The API was designed to be consumed asynchronously by the `Frontend` interface (React), but its decoupled architecture allows it to be easily integrated by third-party systems, CI/CD tools, or automation and testing scripts.

## 1. Base Information

All requests must follow the standard HTTP pattern. The standard data exchange format (for both the request payload and the response) is **JSON** (`application/json`).

*   **Base URL (Local Development):** `http://localhost:3001`
*   **Base URL (Production - Proposed):** `https://api.sensiomat.com`

---

## 2. Currently Implemented Endpoints (Operational MVP)

The current version of the system exposes two main *endpoints*, responsible for providing the static materials physics dictionary and for the heuristic processing.

### 2.1. Get Materials Catalog
Returns the complete list of available materials in the system, categorized with their respective thermodynamic and mechanical properties.

*   **Module:** `Backend` / `Data Layer`
*   **HTTP Method:** `GET`
*   **Route:** `/api/v1/catalog`
*   **Query Parameters:** None.

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "materialsCount": 11,
    "environmentsCount": 4,
    "materials": [
      {
        "id": "mat_cu_01",
        "name": "Pure Copper (Cu)",
        "category": "Metal",
        "mechanical": {
          "elasticModulusGPa": 110,
          "tensileStrengthMPa": 220,
          "isFlexible": true
        },
        "electrical": {
          "conductivitySm": 58500000,
          "bandgapEV": 0,
          "isConductor": true
        },
        "thermal": {
          "thermalConductivityWmK": 398,
          "maxOperatingTempC": 150
        },
        "magnetic": {
          "behavior": "Diamagnetic",
          "causesInterference": false
        },
        "optical": {
          "isTransparent": false
        },
        "deteriorative": {
          "oxidationResistance": 4,
          "isBiocompatible": false
        }
      }
    // ... other materials
    ]
  }
}
```

### 2.2. Execute Heuristic Simulation
This is the core of the application. It receives the stack topology (Substrate, Circuit, Encapsulation) and the target environment. The physics engine processes these inputs and returns the viability diagnosis.

*   **Module:** `Backend` / `Service Layer`
*   **HTTP Method:** `POST`
*   **Route:** `/api/v1/simulate`
*   **Headers:** `Content-Type: application/json`

**Request Payload (Body):**
```json
{
  "environmentId": "env_body_implant",
  "stack": {
    "substrate": "mat_alumina_01",
    "circuit": "mat_cu_01",
    "encapsulation": "mat_pdms_01"
  }
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "simulation": {
    "simulationTimestamp": "2026-07-11T03:46:37.906Z",
    "environmentTested": "Epidermal Biosensor / Implant",
    "globalStatus": "REJECTED",
    "viabilityScorePercentage": 86,
    "propertiesAnalyzedCount": 7,
    "criticalFailuresDetected": 1,
    "diagnosticLogs": [
      {
        "propertyKey": "prop_mechanics",
        "status": "CRITICAL_FAIL",
        "layerKey": "layer_base",
        "material": "Aluminum Oxide / Alumina (Al2O3)",
        "reasonKey": "reason_mech_fail",
        "reasonVars": {
          "modulus": 380
        }
      },
      {
        "propertyKey": "prop_electrical",
        "status": "PASS",
        "layerKey": "layer_mid",
        "material": "Pure Copper (Cu)",
        "reasonKey": "reason_elec_pass"
      },
      {
        "propertyKey": "prop_therm_struct",
        "status": "PASS",
        "layerKey": "layer_global",
        "materialKey": "mat_multiple",
        "reasonKey": "reason_therm_struct_pass"
      },
      {
        "propertyKey": "prop_fourier",
        "status": "PASS",
        "layerKey": "layer_interface",
        "material": "Pure Copper (Cu) / PDMS (Industrial Silicone)",
        "reasonKey": "reason_fourier_pass"
      },
      {
        "propertyKey": "prop_magnetic",
        "status": "PASS",
        "layerKey": "layer_top",
        "material": "PDMS (Industrial Silicone)",
        "reasonKey": "reason_mag_pass"
      },
      {
        "propertyKey": "prop_optical",
        "status": "PASS",
        "layerKey": "layer_base",
        "material": "Aluminum Oxide / Alumina (Al2O3)",
        "reasonKey": "reason_optic_pass"
      },
      {
        "propertyKey": "prop_corrosion",
        "status": "PASS",
        "layerKey": "layer_top",
        "material": "PDMS (Industrial Silicone)",
        "reasonKey": "reason_corr_pass"
      }
    ]
  }
}
```

---

## 3. HTTP Status Codes

The API uses rigorous semantic conventions for status codes:

| Code | Meaning | Description |
| :--- | :--- | :--- |
| **200** | `OK` | Request processed and calculation completed successfully. |
| **400** | `Bad Request` | Validation error. Occurs if the stack sent in `/simulate` is incomplete (e.g., missing encapsulation). |
| **404** | `Not Found` | Route not found or requested material does not exist in the in-memory catalog. |
| **500** | `Internal Error` | Critical failure in heuristic processing (e.g., division by zero in the equations engine). |

---

## 4. Testing and Debugging

For developers and rapid integration, the API can be tested via the terminal using cURL, simulating exactly the Frontend behavior:

```bash
# Simulation Test via cURL
curl -X POST http://localhost:3001/api/v1/simulate \
-H "Content-Type: application/json" \
-d '{"environmentId":"env_body_implant","stack":{"substrate":"mat_pdms_01","circuit":"mat_au_01","encapsulation":"mat_pdms_01"}}'
```

---

## 5. Conceptual Proposal (Future Versions)

As the system migrates from an in-memory-based MVP to a distributed architecture, the API will be expanded with the following *endpoints*:

1.  **[API] Authentication and Session Management:**
    *   `POST /api/auth/login`: JWT (JSON Web Tokens) token generation.
    *   `GET /api/users/projects`: Retrieval of the user's simulation history (requires future integration with PostgreSQL).
2.  **[Scientific API] Quantum Synchronization Proxy:**
    *   `POST /api/materials/sync-external`: An administrator *endpoint* designed to connect SensioMat to the external API of the *Materials Project* (MIT/Berkeley), updating the system's periodic table with new structural calculation vectors in real-time.
3.  **[Infrastructure] Rate Limiting:**
    *   Implementation of request-limiting *middlewares* (e.g., 50 simulations per minute per IP) to prevent DDoS attacks or CPU exhaustion, given the computational weight of the heuristic engine's equations.