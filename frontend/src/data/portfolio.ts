export const portfolioData = {
  name:     "Preeti Hegde",
  title:    "AI Engineer + Software Developer",
  tagline:  "Building intelligent systems that bridge the gap between cutting-edge AI and real-world impact.",
  email:    "preetivhegde98@gmail.com",
  github:   "https://github.com/preetihegde",
  linkedin: "https://linkedin.com/in/preetivhegde",
  medium:   "https://medium.com/@preetivhegde",
  location: "Germany",
  city: "Würzburg",

  // ── Bilingual content ──────────────────────────────────────────────────────
  about: {
    en: `I'm an AI Engineer with a strong focus on building LLMs and scalable AI pipelines.
With experience in both AI and software development, I create applications that don't just stay as ideas or models, but work in production.
From LLM-powered tools to backend systems, I focus on making AI practical, reliable, and easy to use.
I enjoy understanding how things work and questioning my approach, which helps me build better, more meaningful solutions.`,
    de: `Ich bin KI-Ingenieurin mit Schwerpunkt auf dem Aufbau von LLMs und skalierbaren KI-Pipelines.
Mit Erfahrung in KI und Softwareentwicklung erstelle ich Anwendungen, die nicht nur als Ideen oder Modelle existieren, sondern in der Produktion funktionieren.
Von LLM-gestützten Tools bis hin zu Backend-Systemen konzentriere ich mich darauf, KI praktisch, zuverlässig und einfach nutzbar zu machen.
Ich verstehe gerne, wie Dinge funktionieren, und hinterfrage meinen Ansatz — das hilft mir, bessere und sinnvollere Lösungen zu entwickeln.`,
  },

  experience: [
    {
      id: "exp1",
      role:    { en: "AI and Machine Learning Engineer Intern", de: "Praktikantin KI- und Maschinenlernentwicklung" },
      company: "Chi2 Data Analytics and Artificial Intelligence GmbH",
      period:  "Nov 2025 – Jan 2026",
      location: { en: "Germany", de: "Deutschland" },
      description: {
        en: `Developed predictive models using machine learning and statistical techniques on large real-world datasets (10K+ records), improving accuracy and insight generation for decision-making.

Implemented AI-driven workflows integrating statistical inference with machine learning in Python, reducing analysis time and enabling scalable data processing.

Created structured data visualizations and analytical summaries, improving interpretability of complex datasets and supporting actionable insights.`,
        de: `Entwicklung von Vorhersagemodellen mit ML- und statistischen Verfahren auf großen realen Datensätzen (10K+ Einträge) zur Verbesserung der Entscheidungsgenauigkeit.

Implementierung KI-gesteuerter Workflows mit statistischer Inferenz und Machine Learning in Python — kürzere Analysezeiten und skalierbare Datenverarbeitung.

Erstellung strukturierter Datenvisualisierungen und analytischer Zusammenfassungen zur besseren Interpretierbarkeit komplexer Datensätze.`,
      },
      tech: ["Python", "Machine Learning", "Statistical Data", "Neural Networks", "Clean Code"],
    },
    {
      id: "exp2",
      role:    { en: "Software Engineer", de: "Software-Ingenieurin" },
      company: "Altisource",
      period:  "Jan 2021 – Mar 2023",
      location: { en: "India", de: "Indien" },
      description: {
        en: `In a distributed microservices environment, developed and deployed RESTful APIs using Spring Boot, enabling seamless service communication and achieving 90%+ system uptime.

Redesigned workflows using a multi-threaded Spring Batch architecture, improving processing speed by 30% and overall system efficiency.

Led integrations across 5 business divisions, reducing system dependencies and improving cross-functional collaboration.

Integrated Stripe using REST APIs and webhooks, ensuring reliable transaction processing and automated reconciliation.

Led debugging and optimization efforts, reducing downtime by 25% and significantly improving platform stability.

Leveraged AWS services to enhance scalability and resource utilization by 30%, improving deployment flexibility.`,
        de: `In einer verteilten Microservices-Umgebung entwickelt und bereitgestellt: RESTful APIs mit Spring Boot — nahtlose Kommunikation und 90%+ Systemverfügbarkeit.

Workflows mit Multi-Threaded Spring Batch neu gestaltet — Verarbeitungsgeschwindigkeit um 30% gesteigert.

Integrationen über 5 Geschäftsbereiche geleitet — Systemabhängigkeiten reduziert und abteilungsübergreifende Zusammenarbeit verbessert.

Stripe über REST APIs und Webhooks integriert für zuverlässige Transaktionsverarbeitung und automatische Abstimmung.

Debugging- und Optimierungsmaßnahmen geleitet — Ausfallzeiten um 25% reduziert und Plattformstabilität verbessert.

AWS-Dienste eingesetzt zur Steigerung der Skalierbarkeit und Ressourcenauslastung um 30%.`,
      },
      tech: ["Java", "Spring Boot", "Flowable", "MySQL", "Kafka", "AWS", "Clean Code", "Scrum"],
    },
  ],

  projects: [
    {
      id:    "proj1",
      title: {en: "Uttara AI: AI-Powered Personal RAG Chatbot", de:"Uttara AI: KI-gestützter RAG-Chatbot"},
      description: {
        en: `An AI-powered conversational assistant that understands user queries, retrieves relevant information, and handles follow-up questions with context using a Retrieval-Augmented Generation (RAG) pipeline.
             It enables recruiters or users to ask questions and get precise, grounded answers without navigating the entire portfolio, improving accessibility, reducing search effort and making exploration faster and more intuitive.`,
        de: `Ein KI-gestützter Chatbot, der Benutzerfragen versteht, relevante Informationen abruft und Folgefragen im Kontext beantwortet, basierend auf einer Retrieval-Augmented Generation (RAG) Pipeline.
             Er ermöglicht es Recruitern oder Nutzern, gezielte Fragen zu stellen und präzise, faktenbasierte Antworten zu erhalten, ohne das gesamte Portfolio durchsuchen zu müssen.
             Dadurch wird der Zugang erleichtert, der Suchaufwand reduziert und die Nutzung schneller und intuitiver.`
      },
      tech: ["Python", "FastAPI", "LangChain", "RAG Architecture", "Groq", "ChromaDB", "HuggingFace Embeddings", "React"],
      featured: true,
      github: "#",
      demo:  {type: "chatbot"}
    },
    {
      id:    "proj2",
      title: { en: "Joint Image Classification & Anomaly Detection for Resuable Containers", de: "Gemeinsame Bildklassifikation & Anomalieerkennung" },
      description: {
        en: `Developed as part of my master’s thesis, this project focuses on classifying different types of containers and detecting defects using multi-view image data within a shared architecture.
            The system combines deep learning-based classification with anomaly detection to identify unseen or irregular defects, improving inspection accuracy and efficiency while reducing inference time and manual effort across multiple camera angles.`,
        de: `Im Rahmen meiner Masterarbeit wurde ein System entwickelt, das verschiedene Containertypen klassifiziert und Defekte mithilfe von Bildern aus mehreren Kameraperspektiven erkennt.
            Durch die Kombination von Deep Learning und Anomalieerkennung können auch unbekannte Defekte identifiziert werden. Dadurch wird die Inspektion genauer, schneller und erfordert weniger manuellen Aufwand.`,
      },
      tech: ["PatchCore", "Python", "PyTorch", "Computer Vision", "CNN", "Multi-view Learning"],
      featured: true,
      github: "https://github.com/preetihegde/Joint-Image-Classification-and-Anomaly-Detection-for-Efficient-Inspection-of-Reusable-Containers",
      demo:   null,
    },
    {
      id:    "proj3",
      title: { en: "FileChatAI", de: "FileChatAI" },
      description: {
        en: `FileChatAI is an event-driven RAG application designed to enable intelligent querying of documents. The system ingests PDF files, processes and stores embeddings in a vector database, and allows users to retrieve context-aware answers through natural language queries.
             It leverages an asynchronous architecture for efficient document processing, improving search and retrieval while reducing manual effort in scanning documents, and delivers faster query responses.`,
        de: `FileChatAI ist eine eventgesteuerte RAG-Anwendung, die eine intelligente Abfrage von Dokumenten ermöglicht.
             Das System verarbeitet PDF-Dateien, erstellt Embeddings und speichert diese in einer Vektordatenbank. Nutzer können Fragen in natürlicher Sprache stellen und kontextbezogene Antworten erhalten.
             Durch die asynchrone Architektur wird die Verarbeitung effizienter, die Suche verbessert und der manuelle Aufwand beim Lesen von Dokumenten reduziert, während gleichzeitig schnellere Antworten geliefert werden.`,
      },
      tech: ["Python", "FastAPI", "LangChain", "Qdrant", "HuggingFace Embedding", "Inngest", "RAG Architecture"],
      featured: false,
      github: "https://github.com/preetihegde/FileChatAI-Search-understand-and-query-your-files",
      demo:   null,
    },
    {
      id:    "proj3",
      title: { en: "FileChatAI", de: "FileChatAI" },
      description: {
        en: `Summarise It is a lightweight Chrome extension that enables users to summarize selected text directly from any webpage.
              By integrating a Spring Boot backend with the Gemini API, the system provides concise and meaningful summaries in real time, improving content consumption and productivity.`,
        de: `Summarise It ist eine leichte Chrome-Erweiterung, mit der Nutzer ausgewählten Text direkt auf jeder Webseite zusammenfassen können.
             Durch die Integration eines Spring-Boot-Backends mit der Gemini API liefert das System in Echtzeit kurze und verständliche Zusammenfassungen. Dadurch wird das Lesen einfacher und die Produktivität verbessert.`,
      },
      tech: ["Java", "REST APIs", "Spring Boot", "Chrome Extension", "Gemini API"],
      featured: false,
      github: "https://github.com/preetihegde/Summarise_it",
      demo:   null,
    },
  ],

  skills: {
    "AI & ML":          ["LLMs", "Generative AI", "RAG", "Transformer Architectures", "LangChain", "LangGraph", "SentenceTransformers", "Computer Vision", "NLP", "Predictive Modeling", "PyTorch", "Prompt Engineering"],
    "Backend":          ["Java", "Python", "Spring Boot", "FastAPI", "REST APIs", "SOAP APIs", "Microservices", "Kafka", "Event-Driven Architecture"],
    "Frontend":         ["React", "TypeScript", "Tailwind CSS", "Vite"],
    "Databases":        ["SQL", "MySQL", "PostgreSQL", "Vector Databases"],
    "DevOps & Cloud":   ["Data Pipelines", "ETL", "AWS", "Docker", "CI/CD"],
    "Tools & Practices":["Git", "Maven", "Postman", "Agile (Scrum)"],
  },

  // Skills category name translations
  skillCategories: {
    en: { "AI & ML": "AI & ML", "Backend": "Backend", "Frontend": "Frontend", "Databases": "Datenbanken", "DevOps & Cloud": "DevOps & Cloud", "Tools & Practices": "Tools & Practices" },
    de: { "AI & ML": "KI & ML", "Backend": "Backend", "Frontend": "Frontend", "Databases": "Datenbanken", "DevOps & Cloud": "DevOps & Cloud", "Tools & Practices": "Tools & Methoden" },
  },

  education: [
    {
      degree:      { en: "M.Sc. Artificial Intelligence",   de: "M.Sc. Künstliche Intelligenz" },
      institution: "Technische Hochschule Würzburg-Schweinfurt",
      period:      "Mar 2023 — Jun 2025",
      location:    { en: "Würzburg, Germany", de: "Würzburg, Deutschland" },
      thesis:      {
        en:  "Joint Image Classification and Anomaly Detection for Efficient Inspection of Reusable Containers",
        de:  "Gemeinsame Bildklassifikation und Anomalieerkennung für die effiziente Inspektion von Mehrwegbehältern",
        url: "https://github.com/preetihegde/Joint-Image-Classification-and-Anomaly-Detection-for-Efficient-Inspection-of-Reusable-Containers",   // ← replace with your actual thesis URL / PDF link
      },
    },
    {
      degree:      { en: "B.E. Computer Science", de: "B.E. Informatik" },
      institution: "Sri Siddhartha Institute Of Technology",
      period:      "Aug 2016 — Jun 2021",
      location:    { en: "Tumkur, India", de: "Tumkur, Indien" },
      thesis:      {
        en:  "Feedback and Recommendation System using Natural Language Processing",
        de:  "Feedback- und Empfehlungssystem mit Verarbeitung natürlicher Sprache",
        url: "https://sahe.in/jir/journal_management/production/plagiarism_files/VOL_01%20ISSUE%2002_3.pdf",  // ← add URL if you have one
      },
    },
  ],
}


export type Lang = 'en' | 'de'
export const t = (field: { en: string; de: string }, lang: Lang) => field[lang]
