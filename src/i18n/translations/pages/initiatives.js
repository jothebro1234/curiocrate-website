// Strings for the two "Initiatives" pages — KitDevelopment.jsx (STEM Advocacy Competition +
// Kit Development tabs) and HandsOnTeaching.jsx. Namespaced under `kitDevelopment` and
// `handsOnTeaching` respectively — see common.js for how per-page files like this one get
// merged, and CLAUDE.md for the convention every page-translation file follows.
export const en = {
  kitDevelopment: {
    eyebrow: 'Initiatives',
    applyNow: 'Apply Now',
    tabs: {
      stemAdvocacy: 'STEM Advocacy Project (Competition)',
      kitDevelopment: 'Kit Research Internship',
    },
    stem: {
      prizeMoneyLabel: 'In Prize Money',
      partnership: 'CurioCrate × Youth Civics Think Tank',
      headline: 'A national platform where students turn STEM equity research into real policy action.',
      description: 'Teams research and pitch real STEM equity solutions on video, then bring their strongest ideas straight to the school leaders who can act on them.',
      promptsLabel: 'The Prompts',
      countdownLabel: 'Applications Close In',
      countdownClosed: 'Applications are closed',
      countdownDays: 'Days',
      countdownHours: 'Hrs',
      countdownMinutes: 'Min',
      countdownSeconds: 'Sec',
      details: {
        who: { label: 'WHO', value: '2 to 3 high school students' },
        startDate: { label: 'START DATE', value: 'August 8, 2026' },
        endDate: { label: 'END DATE', value: 'September 9, 2026, 11:59 PM PST' },
        format: { label: 'FORMAT', value: 'Video pitch + one-pager' },
      },
      prompts: {
        video: {
          label: 'Video Prompt',
          text: 'You have 3 minutes to pitch to School Board Member Ms. Garcia. Convince her why STEM advocacy matters, and tell her exactly one action you want her to take.',
        },
        onePager: {
          label: 'One-Pager Prompt',
          text: 'If you could change one aspect of STEM education for middle and elementary school students, what would it be, why does the data support it, and how could it realistically be implemented?',
        },
      },
    },
    kit: {
      statusBadge: 'First Rolling Batch — Applications Open',
      eyebrow: 'CurioCrate Product Leadership · Selective Research Internship',
      fundedLabel: 'Funded Per Selected Creator',
      headline: 'Build a real product. Earn a real title: Certified CurioCrate Creator.',
      description: "This isn't a worksheet packet or a participation certificate. It's a selective, rolling-admission research internship where a small cohort of high schoolers designs an actual CurioCrate kit, ships it to real classrooms, and walks away with a credential that proves they built something that mattered.",
      benefitsLabel: 'What You Get As A Creator',
      benefits: {
        credit: {
          title: 'CurioCrate Creator Credit',
          desc: 'Your name stays attached to the kit and its materials — a real product you developed, shown on the main website and on the kit packaging itself. You become a certified CurioCrate Creator.',
        },
        hours: {
          title: 'Documented Volunteer Hours',
          desc: 'Verifiable service hours for school, scholarship, and service requirements.',
        },
        connections: {
          title: 'Guaranteed Professor & Professional Connections',
          desc: "We introduce your kit, and you, to university professors and subject-matter experts in your kit's field of science who partner with CurioCrate to review your work and give feedback.",
        },
        funding: {
          title: 'We Fund Everything',
          desc: "You don't pay to build your idea. CurioCrate funds your prototype up to $20, and up to $1,000 worth of production for your kit.",
        },
        mentorship: {
          title: 'Real Mentorship',
          desc: "One-on-one guidance from CurioCrate's Product Leadership team through every stage of turning an idea into a product.",
        },
        impact: {
          title: 'Serving an Underserved Area',
          desc: "Your kit is used as a teacher's aid or student resource in underserved communities — real classrooms, real impact.",
        },
      },
      applyCta: 'Apply Now — Cohort 01',
      urgencyNote: 'Rolling admissions. Seats are limited per cohort and reviewed as applications come in — early applicants get first consideration.',
      details: {
        who: { label: 'WHO', value: '2 to 3 high school students' },
        date: { label: 'ADMISSIONS', value: 'Rolling — Cohort 01 Open' },
        deliverable: { label: 'DELIVERABLE', value: 'A produced, distributed science kit' },
        targetImpact: { label: 'TARGET IMPACT', value: 'Underserved students and classrooms in Los Angeles and Orange Counties' },
      },
    },
  },
  handsOnTeaching: {
    eyebrow: 'Initiatives',
    headline: { line1: 'Hands-On', line2: 'Teaching.' },
    intro: 'We bring science directly to communities. From school classrooms to community centers, CurioCrate volunteers run immersive, experiment-based sessions that make learning real and memorable.',
    inFocus: {
      label: 'In Focus',
      headlineLine1: 'Science, in the wild.',
      headlineLine2: 'Moments that matter.',
    },
    involved: {
      label: 'How to Get Involved',
      headlineLine1: 'Two ways to make',
      headlineLine2: 'an impact.',
    },
    parts: {
      inPerson: {
        title: 'In-Person Teaching',
        tag: 'On Location',
        desc: 'We travel to schools, community centers, libraries, and other organizations to lead immersive science workshops. Students work through real experiments with materials we bring, guided by trained CurioCrate volunteers.',
      },
      curriculum: {
        title: 'Curriculum Development',
        tag: 'Remote / Anywhere',
        desc: 'Help design the lesson guides and experiment curricula that power every CurioCrate session. This role is fully remote and open to anyone passionate about making science accessible and engaging.',
      },
    },
    joinViaPortal: 'Join via Portal',
  },
}

export const es = {
  kitDevelopment: {
    eyebrow: 'Iniciativas',
    applyNow: 'Solicitar Ahora',
    tabs: {
      stemAdvocacy: 'Proyecto de Promoción STEM (Concurso)',
      kitDevelopment: 'Pasantía de Investigación de Kits',
    },
    stem: {
      prizeMoneyLabel: 'En Premios',
      partnership: 'CurioCrate × Youth Civics Think Tank',
      headline: 'Una plataforma nacional donde los estudiantes convierten la investigación sobre equidad en STEM en acción política real.',
      description: 'Los equipos investigan y presentan en video soluciones reales para la equidad en STEM, y luego llevan sus mejores ideas directamente a los líderes escolares que pueden ponerlas en práctica.',
      promptsLabel: 'Las Consignas',
      countdownLabel: 'Las Solicitudes Cierran En',
      countdownClosed: 'Las solicitudes están cerradas',
      countdownDays: 'Días',
      countdownHours: 'Hrs',
      countdownMinutes: 'Min',
      countdownSeconds: 'Seg',
      details: {
        who: { label: 'QUIÉNES', value: '2 a 3 estudiantes de preparatoria' },
        startDate: { label: 'FECHA DE INICIO', value: '8 de agosto de 2026' },
        endDate: { label: 'FECHA DE CIERRE', value: '9 de septiembre de 2026, 11:59 PM (hora del Pacífico)' },
        format: { label: 'FORMATO', value: 'Pitch en video + resumen de una página' },
      },
      prompts: {
        video: {
          label: 'Consigna del Video',
          text: 'Tienes 3 minutos para presentarle tu propuesta a la Sra. García, miembro de la Junta Escolar. Convéncela de por qué importa la promoción de STEM y dile exactamente una acción que quieres que tome.',
        },
        onePager: {
          label: 'Consigna del Resumen',
          text: 'Si pudieras cambiar un aspecto de la educación STEM para estudiantes de primaria y secundaria, ¿cuál sería, por qué lo respaldan los datos y cómo podría implementarse de manera realista?',
        },
      },
    },
    kit: {
      statusBadge: 'Primer Lote Continuo — Solicitudes Abiertas',
      eyebrow: 'Liderazgo de Producto de CurioCrate · Pasantía de Investigación Selectiva',
      fundedLabel: 'Financiado Por Creador Seleccionado',
      headline: 'Construye un producto real. Gana un título real: Creador Certificado de CurioCrate.',
      description: 'Esto no es un paquete de hojas de trabajo ni un certificado de participación. Es una pasantía de investigación selectiva y de admisión continua donde un pequeño grupo de estudiantes de preparatoria diseña un kit real de CurioCrate, lo envía a aulas reales y se lleva una credencial que demuestra que construyeron algo que importó.',
      benefitsLabel: 'Lo Que Obtienes Como Creador',
      benefits: {
        credit: {
          title: 'Crédito de Creador CurioCrate',
          desc: 'Tu nombre permanece vinculado al kit y sus materiales: un producto real que desarrollaste, mostrado en el sitio web principal y en el empaque del kit. Te conviertes en un Creador Certificado de CurioCrate.',
        },
        hours: {
          title: 'Horas de Voluntariado Documentadas',
          desc: 'Horas de servicio verificables para requisitos escolares, de becas y de servicio.',
        },
        connections: {
          title: 'Conexiones Garantizadas con Profesores y Profesionales',
          desc: 'Presentamos tu kit, y a ti, a profesores universitarios y expertos en la materia del campo científico de tu kit, quienes colaboran con CurioCrate para revisar tu trabajo y darte retroalimentación.',
        },
        funding: {
          title: 'Financiamos Todo',
          desc: 'No pagas para construir tu idea. CurioCrate financia tu prototipo hasta $20, y hasta $1,000 en producción para tu kit.',
        },
        mentorship: {
          title: 'Mentoría Real',
          desc: 'Guía personalizada del equipo de Liderazgo de Producto de CurioCrate en cada etapa de convertir una idea en un producto.',
        },
        impact: {
          title: 'Sirviendo a un Área Desatendida',
          desc: 'Tu kit se usa como apoyo docente o recurso estudiantil en comunidades desatendidas: aulas reales, impacto real.',
        },
      },
      applyCta: 'Solicitar Ahora — Cohorte 01',
      urgencyNote: 'Admisiones continuas. Los lugares son limitados por cohorte y se revisan conforme llegan las solicitudes: quienes solicitan primero reciben prioridad.',
      details: {
        who: { label: 'QUIÉNES', value: '2 a 3 estudiantes de preparatoria' },
        date: { label: 'ADMISIONES', value: 'Continuas — Cohorte 01 Abierta' },
        deliverable: { label: 'ENTREGABLE', value: 'Un kit de ciencia producido y distribuido' },
        targetImpact: { label: 'IMPACTO OBJETIVO', value: 'Estudiantes y aulas desatendidas en los condados de Los Ángeles y Orange' },
      },
    },
  },
  handsOnTeaching: {
    eyebrow: 'Iniciativas',
    headline: { line1: 'Enseñanza', line2: 'Práctica.' },
    intro: 'Llevamos la ciencia directamente a las comunidades. Desde aulas escolares hasta centros comunitarios, los voluntarios de CurioCrate dirigen sesiones inmersivas basadas en experimentos que hacen que el aprendizaje sea real y memorable.',
    inFocus: {
      label: 'En Primer Plano',
      headlineLine1: 'Ciencia, en su hábitat natural.',
      headlineLine2: 'Momentos que importan.',
    },
    involved: {
      label: 'Cómo Involucrarte',
      headlineLine1: 'Dos formas de generar',
      headlineLine2: 'un impacto.',
    },
    parts: {
      inPerson: {
        title: 'Enseñanza Presencial',
        tag: 'En el Lugar',
        desc: 'Viajamos a escuelas, centros comunitarios, bibliotecas y otras organizaciones para dirigir talleres de ciencia inmersivos. Los estudiantes realizan experimentos reales con materiales que nosotros llevamos, guiados por voluntarios capacitados de CurioCrate.',
      },
      curriculum: {
        title: 'Desarrollo de Currículo',
        tag: 'Remoto / Desde Cualquier Lugar',
        desc: 'Ayuda a diseñar las guías de lecciones y los planes de experimentos que dan vida a cada sesión de CurioCrate. Este rol es completamente remoto y está abierto a cualquier persona apasionada por hacer la ciencia accesible y atractiva.',
      },
    },
    joinViaPortal: 'Únete a través del Portal',
  },
}
