<script>
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  
  let visible = false
  let titleVisible = false
  let subtitleVisible = false
  
  const titles = [
    'Software Engineering Manager',
    'Machine Learning Engineer',
    'Systems Architect',
    'Team Leader',
    'Problem Solver'
  ]
  
  let currentTitleIndex = 0
  let currentTitle = titles[0]
  
  onMount(() => {
    visible = true
    setTimeout(() => titleVisible = true, 300)
    setTimeout(() => subtitleVisible = true, 600)
    
    const interval = setInterval(() => {
      currentTitleIndex = (currentTitleIndex + 1) % titles.length
      currentTitle = titles[currentTitleIndex]
    }, 3000)
    
    return () => clearInterval(interval)
  })
</script>

{#if visible}
  <section class="hero" transition:fade={{ duration: 500 }}>
    <div class="hero-content">
      {#if titleVisible}
        <h1 transition:fly={{ y: 20, duration: 500 }}>Brett Plemons</h1>
      {/if}
      
      {#if subtitleVisible}
        <div class="subtitle-container" transition:fly={{ y: 20, duration: 500, delay: 200 }}>
          <p class="subtitle">
            Transforming Ideas Into Impact as a
          </p>
          <p class="dynamic-title">
            {#key currentTitle}
              <span in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
                {currentTitle}
              </span>
            {/key}
          </p>
        </div>
      {/if}
      
      <div class="hero-actions" transition:fly={{ y: 20, duration: 500, delay: 400 }}>
        <a href="#featured-projects" class="cta-button primary">View Projects</a>
        <a href="https://www.linkedin.com/in/brettplemons" target="_blank" rel="noopener noreferrer" class="cta-button secondary">
          Connect on LinkedIn
        </a>
      </div>
    </div>
    
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
  </section>
{/if}

<style>
  .hero {
    position: relative;
    text-align: center;
    padding: 6rem 2rem;
    border-radius: 1.5rem;
    margin-bottom: 4rem;
    overflow: hidden;
    background: #0f172a;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
  }
  
  h1 {
    font-size: 4rem;
    margin: 0;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }
  
  .subtitle-container {
    margin: 1.5rem 0 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
    margin: 0;
    color: #94a3b8;
    font-weight: 400;
  }
  
  .dynamic-title {
    font-size: 2rem;
    margin: 0.5rem 0 0;
    color: #60a5fa;
    font-weight: 600;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .dynamic-title span {
    position: absolute;
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .cta-button {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
  }
  
  .cta-button.primary {
    background: #3b82f6;
    color: white;
  }
  
  .cta-button.primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  
  .cta-button.secondary {
    background: transparent;
    color: #60a5fa;
    border: 2px solid #60a5fa;
  }
  
  .cta-button.secondary:hover {
    background: #60a5fa;
    color: #0f172a;
    transform: translateY(-2px);
  }
  
  .hero-background {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  
  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    animation: float 20s infinite ease-in-out;
  }
  
  .orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    top: -250px;
    left: -250px;
    animation-delay: 0s;
  }
  
  .orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
    bottom: -200px;
    right: -200px;
    animation-delay: 7s;
  }
  
  .orb-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 14s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    .subtitle {
      font-size: 1rem;
    }
    .dynamic-title {
      font-size: 1.5rem;
    }
    .hero {
      padding: 4rem 1.5rem;
    }
  }
</style>