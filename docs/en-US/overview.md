<div align="center">
  <table>
    <tr>
      <td align="center" width="150">
        <img src="../imagens/logo.png" alt="SensioMat Logo" width="120" />
      </td>
      <td>
        <h1>SensioMat: IoT Architecture Engine and Materials Physics Heuristic Analysis</h1>
        <p><strong>Project Overview</strong></p>
      </td>
    </tr>
  </table>
</div>

## 1. The Problem

**The Physical Bottleneck in Digital Innovation**

The Internet of Things (IoT) and wearables revolution has transformed how we interact with the physical world. However, as we advance towards critical applications, from epidermal biosensors for continuous monitoring to precision agriculture solutions focused on sustainability and mitigating food scarcity, hardware development hits a central obstacle: **the physical incompatibility of materials**.

IoT architects and hardware engineers lose months (and vast financial resources) in physical prototyping, only to discover that:
* A rigid substrate causes micro-lesions on the patient's dermis.
* The difference in thermal conductivity between the circuit and the encapsulation creates the "Choke Effect," melting the device.
* The material selected for a subsoil sensor undergoes anodic dissolution (corrosion) due to soil acidity within a few days.

Materials science is complex, and the absence of rapid, low-cost validation tools delays the innovation cycle.

## 2. The Solution

**What is SensioMat?**

**SensioMat** was born at the intersection of information, digital health, and sustainable software engineering. It is a web platform designed to **decouple initial physical testing through heuristic software simulation**.

Through an intuitive drag-and-drop interface, the user builds the thermodynamic stack of an IoT sensor (Substrate, Active Circuit, and Encapsulation). The computational engine then processes these choices in milliseconds against the demands of a specific operating environment, returning a rigorous scientific diagnosis regarding the viability of that architecture.

## 3. Target Audience and Use Cases

The project was designed to serve three main profiles:

1. **Academic Researchers and Evaluators:** Who need to validate concepts for new health wearables or environmental sensors based on principles of thermodynamics and mechanics of materials, without the immediate cost of going to the lab.
2. **Hardware Architects / IoT Engineers:** Professionals who design the physical foundation of new devices for hostile environments (e.g., body implants, high-temperature industrial monitoring, precision agriculture in soil).
3. **Investors and Stakeholders (Pitch Mode):** Through the rapid export feature of interactive reports and 3D visuals, the platform acts as a commercial tool to justify technical choices to hardware startup investors.

## 4. Technological Differentiators

* **Low-Latency Deterministic Simulation:** Instead of relying on finite element methods (FEM) that take hours to process, SensioMat uses a vector-rule-based heuristic, delivering instant results.
* **Native Internationalization (i18n):** Ready for the global market, with instant support between English (US) and Portuguese (Angola/Brazil), translating not only the interface but dynamically converting the scientific jargon.
* **Multidimensional Diagnosis:** Evaluates the stack from the perspectives of mechanics (Ch. 6), electrical (Ch. 18), structural thermal (Ch. 19), thermal dissipation (Fourier's Law), magnetic (Ch. 20), optical, and deteriorative/corrosive properties.

## 5. Scope and Project Status

To ensure total technical and academic transparency, the project is divided into the following implementation phases:

### 🟢 Currently Implemented (Operational MVP)
* **[Frontend] Dynamic Interface and 3D Canvas:** Real-time stack building, with interactive 3D spatial representation of the sensor and visual diagnosis export (Pitch Mode).
* **[Backend] Core Heuristic Engine:** Instant evaluation based on pre-computed thermodynamic, mechanical, and electrical rules.
* **[Frontend/Backend] Standalone Catalog:** Static in-memory materials database (JSON), covering metals, ceramics, polymers, semiconductors, and 2D materials.
* **[Frontend] Localization:** Full `pt-AO` and `en-US` support.

### 🟡 Conceptual Proposal / Planned for Future Versions
* **[Scientific Service] Quantum Integration (Materials Project - MIT/Berkeley):** External API connection to import atomic properties of new materials in real time.
* **[Backend] Multilayer Topological Analysis:** Expand the architecture limit from 3 static layers to dynamic stacks (*N-layers*).
* **[Database] Cloud Persistence:** Migration of the JSON catalog to a structured database (e.g., PostgreSQL), allowing users to save projects and simulation history.