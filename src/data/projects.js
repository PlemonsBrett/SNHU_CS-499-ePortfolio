export const projects = [
  {
    id: 'liars-dice',
    title: "Liar's Dice",
    description: 'A strategic dice game implementation in C++ showcasing object-oriented design, AI opponents, and terminal-based UI.',
    image: '/images/projects/liars-dice.png',
    imageAlt: "Liar's Dice game interface",
    link: '/projects/liars-dice',
    github: 'https://github.com/bplemons/liars-dice',
    tags: ['C++', 'Game Development', 'AI', 'OOP'],
    language: ['C++'],
    technology: ['Terminal UI', 'Game AI'],
    category: 'Game Development',
    featured: true
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    description: 'Interactive implementations of Bayesian inference, sorting algorithms, and data structure visualizations.',
    image: '/images/projects/algorithms.png',
    imageAlt: 'Algorithm visualization',
    link: '/projects/algorithms',
    github: 'https://github.com/bplemons/algorithms',
    tags: ['JavaScript', 'Algorithms', 'Data Structures', 'Visualization'],
    language: ['JavaScript'],
    technology: ['Web', 'Interactive'],
    category: 'Education',
    featured: true
  },
  {
    id: 'code-playground',
    title: 'Interactive Code Playground',
    description: 'A secure, browser-based JavaScript execution environment with real-time output and syntax highlighting.',
    image: '/images/projects/code-playground.png',
    imageAlt: 'Code playground interface',
    link: '/projects/code-playground',
    tags: ['JavaScript', 'Svelte', 'Security', 'Developer Tools'],
    language: ['JavaScript', 'Svelte'],
    technology: ['Web', 'Sandbox'],
    category: 'Developer Tools',
    featured: false
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio Website',
    description: 'Modern portfolio site built with Astro, Svelte 5, and MDX. Features immersive scroll animations and interactive components.',
    image: '/images/projects/portfolio.png',
    imageAlt: 'Portfolio website screenshot',
    link: '/',
    github: 'https://github.com/PlemonsBrett/SNHU_CS-499-ePortfolio',
    demo: 'https://portfolio.plemons.dev',
    tags: ['Astro', 'Svelte', 'MDX', 'GSAP', 'TypeScript'],
    language: ['TypeScript', 'JavaScript'],
    technology: ['Astro', 'Svelte 5', 'MDX', 'GSAP'],
    category: 'Web Development',
    featured: true
  },
  {
    id: 'ml-sentiment-analysis',
    title: 'Sentiment Analysis Engine',
    description: 'Machine learning model for analyzing customer sentiment in product reviews using NLP techniques.',
    image: '/images/projects/sentiment-analysis.png',
    imageAlt: 'Sentiment analysis dashboard',
    link: '/projects/sentiment-analysis',
    github: 'https://github.com/bplemons/sentiment-analysis',
    tags: ['Python', 'Machine Learning', 'NLP', 'TensorFlow'],
    language: ['Python'],
    technology: ['TensorFlow', 'scikit-learn', 'NLTK'],
    category: 'Machine Learning',
    featured: false
  },
  {
    id: 'data-pipeline',
    title: 'Real-time Data Pipeline',
    description: 'Scalable data processing pipeline built with Apache Kafka and Python for streaming analytics.',
    image: '/images/projects/data-pipeline.png',
    imageAlt: 'Data pipeline architecture diagram',
    link: '/projects/data-pipeline',
    github: 'https://github.com/bplemons/data-pipeline',
    tags: ['Python', 'Kafka', 'Docker', 'PostgreSQL'],
    language: ['Python', 'SQL'],
    technology: ['Apache Kafka', 'Docker', 'PostgreSQL'],
    category: 'Data Engineering',
    featured: false
  }
]

// Helper function to get featured projects
export const getFeaturedProjects = () => projects.filter(p => p.featured)

// Helper function to get project by ID
export const getProjectById = (id) => projects.find(p => p.id === id)