<div align="center">
  <table>
    <tr>
      <td align="center" width="150">
        <!-- Substitua logo.png pelo nome real do seu arquivo -->
        <img src="./imagens/logo.png" alt="Logo SensioMat" width="120" />
      </td>
      <td>
        <h1>SensioMat: Motor de Arquitetura IoT e Análise Heurística de Física de Materiais</h1>
        <p><strong>Visão Geral do Projeto</strong></p>
      </td>
    </tr>
  </table>
</div>

## 1. O Problema

**O Gargalo Físico na Inovação Digital**

A revolução da Internet das Coisas (IoT) e dos dispositivos *wearables* transformou a forma como interagimos com o mundo físico. No entanto, à medida que avançamos para aplicações críticas, desde biossensores epidérmicos para monitorização contínua até soluções de agricultura de precisão focadas na sustentabilidade e mitigação da escassez alimentar, o desenvolvimento de hardware esbarra num obstáculo central: **a incompatibilidade física dos materiais**.

Arquitetos de IoT e engenheiros de hardware perdem meses (e vastos recursos financeiros) em prototipagem física, apenas para descobrir que:
* Um substrato rígido causa microlesões na derme do paciente.
* A diferença de condutividade térmica entre o circuito e o encapsulamento gera o "Efeito Choke", derretendo o dispositivo.
* O material selecionado para um sensor de subsolo sofre dissolução anódica (corrosão) devido à acidez do solo em poucos dias.

A ciência dos materiais é complexa, e a ausência de ferramentas de validação rápida e de baixo custo atrasa o ciclo de inovação.

## 2. A Solução

**O que é o SensioMat?**

O **SensioMat** nasceu na interseção entre a informação, a saúde digital e a engenharia de software sustentável. É uma plataforma *web* desenhada para **desacoplar a testagem física inicial através de simulação heurística de software**.

Através de uma interface intuitiva de arrastar-e-soltar (*drag-and-drop*), o utilizador constrói a pilha (*stack*) termodinâmica de um sensor IoT (Substrato, Circuito Ativo e Encapsulamento). O motor computacional processa então essas escolhas em milissegundos contra as exigências de um ambiente de operação específico, retornando um diagnóstico científico rigoroso sobre a viabilidade daquela arquitetura.

## 3. Público-Alvo e Casos de Uso

O projeto foi concebido para atender a três perfis principais:

1. **Investigadores e Avaliadores Académicos:** Que necessitam de validar conceitos de novos *wearables* de saúde ou sensores ambientais com base em princípios da termodinâmica e mecânica de materiais, sem o custo imediato de ir para o laboratório.
2. **Arquitetos de Hardware / Engenheiros de IoT:** Profissionais que desenham a base física de novos dispositivos para ambientes hostis (ex: implantes corporais, monitorização industrial de alta temperatura, agricultura de precisão no solo).
3. **Investidores e Stakeholders (Modo Pitch):** Através da funcionalidade de exportação rápida de relatórios interativos e visuais 3D, a plataforma atua como uma ferramenta comercial para justificar escolhas técnicas perante investidores de *hardware startups*.

## 4. Diferenciais Tecnológicos

* **Simulação Determinística de Baixa Latência:** Em vez de depender de métodos de elementos finitos (FEM) que levam horas a processar, o SensioMat utiliza uma heurística baseada em regras vetoriais, entregando resultados instantâneos.
* **Internacionalização Nativa (i18n):** Preparado para o mercado global, com suporte instantâneo entre Inglês (US) e Português (Angola/Brasil), traduzindo não só a interface, mas convertendo o jargão científico dinamicamente.
* **Diagnóstico Multidimensional:** Avalia a pilha sob as óticas da mecânica (Cap. 6), elétrica (Cap. 18), térmica estrutural (Cap. 19), dissipação térmica (Lei de Fourier), magnética (Cap. 20), ótica e propriedades deteriorativas/corrosivas.

## 5. Escopo e Estado do Projeto

Para garantir total transparência técnica e académica, o projeto divide-se nas seguintes fases de implementação:

### 🟢 Implementado Atualmente (MVP Operacional)
* **[Frontend] Interface Dinâmica e Canvas 3D:** Construção da pilha em tempo real, com representação espacial 3D do sensor interativa e exportação de diagnóstico visual (Modo Pitch).
* **[Backend] Motor Heurístico Base:** Avaliação instantânea baseada em regras termodinâmicas, mecânicas e elétricas pré-computadas.
* **[Frontend/Backend] Catálogo Standalone:** Banco de dados de materiais estático em memória (JSON), cobrindo metais, cerâmicas, polímeros, semicondutores e materiais 2D.
* **[Frontend] Localização:** Suporte total `pt-AO` e `en-US`.

### 🟡 Proposta Conceitual / Planejado para Versões Futuras
* **[Serviço Científico] Integração Quântica (Materials Project - MIT/Berkeley):** Conexão via API externa para importar propriedades atómicas de novos materiais em tempo real.
* **[Backend] Análise Topológica Multicamada:** Expandir o limite da arquitetura de 3 camadas estáticas para pilhas dinâmicas (*N-layers*).
* **[Banco de Dados] Persistência em Nuvem:** Migração do catálogo JSON para uma base de dados estruturada (ex: PostgreSQL), permitindo que os utilizadores salvem projetos e histórico de simulações.