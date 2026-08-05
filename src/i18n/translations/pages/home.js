// Static page copy for the Home landing page (src/pages/Home.jsx). Does NOT cover the
// live/imported data rendered on that page (news items from the Google Sheet / src/data/news.js,
// stats from src/data/stats.js, alumni from src/data/alumni.js) — only the static UI chrome
// around it. See CLAUDE.md for the convention every page-translation file follows.
export const en = {
  home: {
    hero: {
      title: {
        line1: 'Science for every',
        em: 'curious mind.',
      },
      subtitle: 'Accessible, immersive, hands-on science kits for underserved students.',
      initiativesButton: 'Our Initiatives',
      menu: {
        howToJoin: 'How Can I Join?',
        viewKits: 'View Kits',
        sectionLabel: 'Initiatives',
        linkInitiatives: 'Initiatives',
        linkTeaching: 'Hands-On Teaching / Curriculum Developer',
      },
      viewGallery: 'View Gallery',
      ourMission: 'Our Mission',
      supportedBy: 'Supported by',
      partners: {
        societyForScience: 'Society for Science',
        connectKeyFoundation: 'Connect Key Foundation',
        ymca: 'YMCA',
      },
    },
    news: {
      live: 'LIVE',
      dispatchLabel: 'CURIOCRATE DISPATCH',
      watermark: 'DISPATCH',
      heading: {
        recent: 'Recent ',
        em: 'News',
      },
      viewSource: 'View Source →',
      featuredDispatch: 'FEATURED DISPATCH',
    },
    whatIs: {
      label: 'Est. 2023',
      title: {
        line1: 'What is',
        em: 'CurioCrate?',
      },
      paragraph1: 'CurioCrate believes every child, regardless of zip code, income, or background, deserves to experience the wonder of real science.',
      paragraph2: 'Our immersive, accessible, hands-on experiment kits, designed by passionate high school volunteers alongside college professors and industry professionals, bring "lab" education to underserved students, paired with live workshops that make learning engaging for early learners.',
      mute: 'Mute',
      unmute: 'Unmute',
    },
    impact: {
      label: 'Our Reach',
      title: {
        line1: 'Every dot is a community',
        em: "we've reached.",
      },
      tapForDetails: 'tap for details',
    },
    map: {
      chapter: 'Chapter',
      impact: 'Impact',
    },
    statModal: {
      escClose: 'ESC · CLOSE',
    },
    alumni: {
      label: 'Our Alumni',
      title: {
        line1: 'Where our leaders',
        em: 'go next.',
      },
    },
    getInvolved: {
      label: 'Join Us',
      title: 'What Can You Do to Get Involved?',
      learnMore: 'Learn More →',
      steps: {
        apply: {
          title: 'Apply as a Volunteer',
          body: 'Join our volunteer network and connect with a team passionate about science education.',
          cta: 'Apply Now →',
        },
        teach: {
          title: 'Teach or Create a Lesson',
          body: 'Design hands-on science lessons or lead your first kit session with real students.',
          cta: 'Apply Now →',
        },
        kitDeveloper: {
          title: 'Become a Kit Developer',
          body: 'Work directly on developing official CurioCrate research kit products distributed to communities.',
          cta: 'Explore Kit Development →',
        },
        startChapter: {
          title: 'Start a Chapter',
          body: 'Lead the program to bring immersive, hands-on science education directly to students at your school and community.',
          cta: 'Get Started →',
        },
      },
    },
    president: {
      label: 'A Message From Our President',
      title: {
        line1: 'Why we do this ',
        em: 'work.',
      },
    },
  },
}

export const es = {
  home: {
    hero: {
      title: {
        line1: 'Ciencia para cada',
        em: 'mente curiosa.',
      },
      subtitle: 'Kits de ciencia accesibles, inmersivos y prácticos para estudiantes desatendidos.',
      initiativesButton: 'Nuestras Iniciativas',
      menu: {
        howToJoin: '¿Cómo Puedo Unirme?',
        viewKits: 'Ver Kits',
        sectionLabel: 'Iniciativas',
        linkInitiatives: 'Iniciativas',
        linkTeaching: 'Enseñanza Práctica / Desarrollador de Currículo',
      },
      viewGallery: 'Ver Galería',
      ourMission: 'Nuestra Misión',
      supportedBy: 'Con el apoyo de',
      partners: {
        societyForScience: 'Society for Science',
        connectKeyFoundation: 'Connect Key Foundation',
        ymca: 'YMCA',
      },
    },
    news: {
      live: 'EN VIVO',
      dispatchLabel: 'BOLETÍN CURIOCRATE',
      watermark: 'BOLETÍN',
      heading: {
        recent: 'Noticias ',
        em: 'Recientes',
      },
      viewSource: 'Ver Fuente →',
      featuredDispatch: 'BOLETÍN DESTACADO',
    },
    whatIs: {
      label: 'Fundada en 2023',
      title: {
        line1: '¿Qué es',
        em: 'CurioCrate?',
      },
      paragraph1: 'CurioCrate cree que todo niño, sin importar su código postal, ingresos u origen, merece experimentar la maravilla de la ciencia real.',
      paragraph2: 'Nuestros kits de experimentos inmersivos, accesibles y prácticos, diseñados por voluntarios de secundaria apasionados junto a profesores universitarios y profesionales de la industria, llevan educación de "laboratorio" a estudiantes desatendidos, combinados con talleres en vivo que hacen el aprendizaje atractivo para los estudiantes más jóvenes.',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
    },
    impact: {
      label: 'Nuestro Alcance',
      title: {
        line1: 'Cada punto es una comunidad',
        em: 'que hemos alcanzado.',
      },
      tapForDetails: 'toca para más detalles',
    },
    map: {
      chapter: 'Capítulo',
      impact: 'Impacto',
    },
    statModal: {
      escClose: 'ESC · CERRAR',
    },
    alumni: {
      label: 'Nuestros Egresados',
      title: {
        line1: 'A dónde van',
        em: 'nuestros líderes.',
      },
    },
    getInvolved: {
      label: 'Únete',
      title: '¿Qué Puedes Hacer para Involucrarte?',
      learnMore: 'Más Información →',
      steps: {
        apply: {
          title: 'Postúlate como Voluntario',
          body: 'Únete a nuestra red de voluntarios y conecta con un equipo apasionado por la educación científica.',
          cta: 'Postúlate Ahora →',
        },
        teach: {
          title: 'Enseña o Crea una Lección',
          body: 'Diseña lecciones de ciencia práctica o dirige tu primera sesión de kit con estudiantes reales.',
          cta: 'Postúlate Ahora →',
        },
        kitDeveloper: {
          title: 'Conviértete en Desarrollador de Kits',
          body: 'Trabaja directamente en el desarrollo de los kits de investigación oficiales de CurioCrate distribuidos a las comunidades.',
          cta: 'Explora el Desarrollo de Kits →',
        },
        startChapter: {
          title: 'Inicia un Capítulo',
          body: 'Lidera el programa para llevar educación científica inmersiva y práctica directamente a los estudiantes de tu escuela y comunidad.',
          cta: 'Comienza Ahora →',
        },
      },
    },
    president: {
      label: 'Un Mensaje de Nuestro Presidente',
      title: {
        line1: 'Por qué hacemos ',
        em: 'este trabajo.',
      },
    },
  },
}
