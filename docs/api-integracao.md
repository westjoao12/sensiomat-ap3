<div align="center">
  <table>
    <tr>
      <td align="center" width="150">
        <!-- Substitua logo.png pelo nome real do seu arquivo -->
        <img src="./imagens/logo.png" alt="Logo SensioMat" width="120" />
      </td>
      <td>
        <h1>SensioMat: Motor de Arquitetura IoT e Análise Heurística de Física de Materiais</h1>
        <p><strong>API de Integração e Endpoints</strong></p>
      </td>
    </tr>
  </table>
</div>

Este documento detalha as interfaces de comunicação (API RESTful) fornecidas pelo `Backend` do SensioMat. A API foi concebida para ser consumida de forma assíncrona pela interface `Frontend` (React), mas a sua arquitetura desacoplada permite que seja facilmente integrada por sistemas de terceiros, ferramentas de CI/CD ou *scripts* de automação e teste.

## 1. Informações Base

Todas as requisições devem seguir o padrão HTTP padrão. O formato de troca de dados padrão (tanto para a carga útil de envio quanto para a resposta) é o **JSON** (`application/json`).

*   **URL Base (Desenvolvimento local):** `http://localhost:3001`
*   **URL Base (Produção - Proposto):** `https://api.sensiomat.com`

---

## 2. Endpoints Implementados Atualmente (MVP Operacional)

A versão atual do sistema expõe dois *endpoints* principais, responsáveis por fornecer o dicionário estático de física de materiais e pelo processamento heurístico.

### 2.1. Obter Catálogo de Materiais
Retorna a lista completa de materiais disponíveis no sistema, categorizados com as suas respetivas propriedades termodinâmicas e mecânicas.

*   **Módulo:** `Backend` / `Data Layer`
*   **Método HTTP:** `GET`
*   **Rota:** `/api/v1/catalog`
*   **Parâmetros de Query:** Nenhum.

**Exemplo de Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "materialsCount": 11,
    "environmentsCount": 4,
    "materials": [
      {
        "id": "mat_cu_01",
        "name": "Cobre Puro (Cu)",
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
          "behavior": "Diamagnético",
          "causesInterference": false
        },
        "optical": {
          "isTransparent": false
        },
        "deteriorative": {
          "oxidationResistance": 4,
          "isBiocompatible": false
        }
      },
    // ... outros materiais
  ]
}
```

### 2.2. Executar Simulação Heurística
É o núcleo da aplicação. Recebe a topologia da pilha (Substrato, Circuito, Encapsulamento) e o ambiente-alvo. O motor físico processa estas entradas e retorna o diagnóstico de viabilidade.

*   **Módulo:** `Backend` / `Service Layer`
*   **Método HTTP:** `POST`
*   **Rota:** `/api/v1/simulate`
*   **Cabeçalhos:** `Content-Type: application/json`

**Carga Útil da Requisição (Body):**
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

**Exemplo de Resposta (200 OK):**
```json
{
  "success": true,
  "simulation": {
    "simulationTimestamp": "2026-07-11T03:46:37.906Z",
    "environmentTested": "Biossensor Epidérmico / Implante",
    "globalStatus": "REJECTED",
    "viabilityScorePercentage": 86,
    "propertiesAnalyzedCount": 7,
    "criticalFailuresDetected": 1,
    "diagnosticLogs": [
      {
        "propertyKey": "prop_mechanics",
        "status": "CRITICAL_FAIL",
        "layerKey": "layer_base",
        "material": "Óxido de Alumínio / Alumina (Al2O3)",
        "reasonKey": "reason_mech_fail",
        "reasonVars": {
          "modulus": 380
        }
      },
      {
        "propertyKey": "prop_electrical",
        "status": "PASS",
        "layerKey": "layer_mid",
        "material": "Cobre Puro (Cu)",
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
        "material": "Cobre Puro (Cu) / PDMS (Silicone Industrial)",
        "reasonKey": "reason_fourier_pass"
      },
      {
        "propertyKey": "prop_magnetic",
        "status": "PASS",
        "layerKey": "layer_top",
        "material": "PDMS (Silicone Industrial)",
        "reasonKey": "reason_mag_pass"
      },
      {
        "propertyKey": "prop_optical",
        "status": "PASS",
        "layerKey": "layer_base",
        "material": "Óxido de Alumínio / Alumina (Al2O3)",
        "reasonKey": "reason_optic_pass"
      },
      {
        "propertyKey": "prop_corrosion",
        "status": "PASS",
        "layerKey": "layer_top",
        "material": "PDMS (Silicone Industrial)",
        "reasonKey": "reason_corr_pass"
      }
    ]
  }
}
```

---

## 3. Códigos de Estado HTTP

A API utiliza convenções semânticas rigorosas para os códigos de estado:

| Código | Significado | Descrição |
| :--- | :--- | :--- |
| **200** | `OK` | Requisição processada e cálculo concluído com sucesso. |
| **400** | `Bad Request` | Erro de validação. Ocorre se a pilha enviada no `/simulate` estiver incompleta (ex: falta de encapsulamento). |
| **404** | `Not Found` | Rota não encontrada ou material requisitado inexistente no catálogo em memória. |
| **500** | `Internal Error` | Falha crítica no processamento heurístico (ex: divisão por zero no motor de equações). |

---

## 4. Testes e Depuração

Para desenvolvedores e integração rápida, a API pode ser testada via terminal utilizando cURL, simulando exatamente o comportamento do Frontend:

```bash
# Teste de Simulação via cURL
curl -X POST http://localhost:3001/api/v1/simulate \
-H "Content-Type: application/json" \
-d '{"environmentId":"env_body_implant","stack":{"substrate":"mat_pdms_01","circuit":"mat_au_01","encapsulation":"mat_pdms_01"}}'
```

---

## 5. Proposta Conceitual (Próximas Versões)

À medida que o sistema migrar de um MVP com base em memória para uma arquitetura distribuída, a API será expandida com os seguintes *endpoints*:

1.  **[API] Autenticação e Gestão de Sessão:**
    *   `POST /api/auth/login`: Geração de *tokens* JWT (JSON Web Tokens).
    *   `GET /api/users/projects`: Recuperação do histórico de simulações do utilizador (requer integração futura com PostgreSQL).
2.  **[API Científica] Proxy de Sincronização Quântica:**
    *   `POST /api/materials/sync-external`: Um *endpoint* de administrador projetado para conectar o SensioMat à API externa do *Materials Project* (MIT/Berkeley), atualizando a tabela periódica do sistema com novos vetores de cálculo estrutural em tempo real.
3.  **[Infraestrutura] Rate Limiting:**
    *   Implementação de *middlewares* limitadores de requisições (ex: 50 simulações por minuto por IP) para prevenir ataques DDoS ou exaustão de CPU, dado o peso computacional das equações do motor heurístico.