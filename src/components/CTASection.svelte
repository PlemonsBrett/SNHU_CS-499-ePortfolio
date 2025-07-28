<script>
  let { 
    title = "Let's Build the Future Together",
    subtitle = "Ready to Transform Ideas Into Impact",
    description = "I'm passionate about solving complex problems at the intersection of engineering excellence and artificial intelligence.",
    links = [
      {
        text: "LinkedIn",
        href: "https://www.linkedin.com/in/brettplemons",
        primary: true
      },
      {
        text: "GitHub", 
        href: "https://github.com/bplemons",
        primary: false
      },
      {
        text: "Projects",
        href: "/projects",
        primary: false
      }
    ],
    quote = {
      text: "The best way to predict the future is to build it.",
      author: "Alan Kay"
    },
    finalCTA = {
      text: "Start a Conversation",
      href: "mailto:brett@plemons.dev"
    }
  } = $props()
</script>

<div class="cta-section">
  {#if title}
    <h2 class="cta-title">{title}</h2>
  {/if}
  
  {#if subtitle}
    <h3 class="cta-subtitle">{subtitle}</h3>
  {/if}
  
  {#if description}
    <p class="cta-description">{description}</p>
  {/if}
  
  {#if links && links.length > 0}
    <div class="cta-links">
      {#each links as link}
        <a 
          href={link.href} 
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          class="cta-link {link.primary ? 'primary' : 'secondary'}"
        >
          {link.text}
        </a>
      {/each}
    </div>
  {/if}
  
  {#if quote}
    <blockquote class="cta-quote">
      <p>"{quote.text}"</p>
      {#if quote.author}
        <cite>— {quote.author}</cite>
      {/if}
    </blockquote>
  {/if}
  
  {#if finalCTA}
    <div class="final-cta">
      <a 
        href={finalCTA.href}
        target={finalCTA.href.startsWith('http') ? '_blank' : undefined}
        rel={finalCTA.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        class="final-cta-button"
      >
        {finalCTA.text}
      </a>
    </div>
  {/if}
</div>

<style>
  .cta-section {
    text-align: center;
    margin: 3rem auto 4rem;
    padding: 3rem;
    background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
    border-radius: 1rem;
    width: 80%;
    max-width: 1000px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  }
  
  .cta-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem;
  }
  
  .cta-subtitle {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem;
  }
  
  .cta-description {
    margin-bottom: 2rem;
    color: #6b7280;
    font-size: 1.125rem;
  }
  
  .cta-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  
  .cta-link {
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
  }
  
  .cta-link.primary {
    background: #6366f1;
    color: white;
  }
  
  .cta-link.primary:hover {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  }
  
  .cta-link.secondary {
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
  }
  
  .cta-link.secondary:hover {
    background: #6366f1;
    color: white;
    transform: translateY(-2px);
  }
  
  .cta-quote {
    margin: 2rem auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border-left: 4px solid #6366f1;
    border-radius: 0.5rem;
    font-style: italic;
    max-width: 600px;
  }
  
  .cta-quote p {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    color: #374151;
  }
  
  .cta-quote cite {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: normal;
    font-weight: 500;
  }
  
  .final-cta {
    margin-top: 2rem;
  }
  
  .final-cta-button {
    padding: 1rem 2.5rem;
    border-radius: 0.75rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.125rem;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    transition: all 0.3s ease;
    display: inline-block;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
  }
  
  .final-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
  }
  
  @media (max-width: 768px) {
    .cta-section {
      width: 100%;
      margin: 0;
      margin-top: 3rem;
      border-radius: 0;
      box-shadow: none;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      color: white;
      padding: 3rem 2rem;
    }
    
    .cta-title,
    .cta-subtitle {
      color: white;
    }
    
    .cta-description {
      color: #d1d5db;
    }
    
    .cta-quote {
      background: rgba(255, 255, 255, 0.1);
      border-left-color: #a5b4fc;
      color: #e5e7eb;
    }
    
    .cta-quote p {
      color: #e5e7eb;
    }
    
    .cta-quote cite {
      color: #9ca3af;
    }
  }

  @media (max-width: 640px) {
    .cta-section {
      padding: 2rem 1.5rem;
    }
    
    .cta-title {
      font-size: 1.75rem;
    }
    
    .cta-subtitle {
      font-size: 1.5rem;
    }
    
    .cta-description {
      font-size: 1rem;
    }
    
    .cta-links {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
      margin: 0 auto 2rem;
    }
    
    .cta-link {
      width: 100%;
      text-align: center;
    }
    
    .cta-quote {
      margin: 1.5rem auto;
      padding: 1rem;
    }
    
    .cta-quote p {
      font-size: 1rem;
    }
    
    .final-cta-button {
      padding: 0.875rem 2rem;
      font-size: 1rem;
    }
  }
</style>