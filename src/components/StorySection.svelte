<script>
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  
  export let chapter = ''
  export let title = ''
  export let subtitle = ''
  export let align = 'left'
  
  let visible = false
  let element
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (element) {
      observer.observe(element)
    }
    
    return () => {
      observer.disconnect()
    }
  })
</script>

<section 
  bind:this={element}
  class="story-section {align}"
>
  {#if visible}
    <div class="section-header" transition:fly={{ y: 30, duration: 600 }}>
      <span class="chapter-number">Chapter {chapter}</span>
      <h2>{title}</h2>
      <p class="subtitle">{subtitle}</p>
    </div>
    
    <div class="section-content" transition:fade={{ delay: 300, duration: 600 }}>
      <slot />
    </div>
  {/if}
</section>

<style>
  .story-section {
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
  }
  
  .story-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%);
    z-index: -1;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .chapter-number {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6366f1;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background: #eef2ff;
    border-radius: 2rem;
  }
  
  .section-header h2 {
    font-size: 3rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0.5rem 0;
    letter-spacing: -0.02em;
  }
  
  .section-header .subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    margin: 0.5rem 0 0;
  }
  
  .section-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.125rem;
    line-height: 1.8;
    color: #374151;
  }
  
  .section-content :global(p) {
    margin-bottom: 1.5rem;
  }
  
  .section-content :global(.stats-grid) {
    margin: 2rem -1rem;
  }
  
  .section-content :global(.project-grid) {
    margin: 2rem 0;
  }
  
  .section-content :global(.cta-section) {
    text-align: center;
    margin-top: 3rem;
    padding: 3rem;
    background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
    border-radius: 1rem;
  }
  
  .section-content :global(.cta-section h3) {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem;
  }
  
  .section-content :global(.cta-buttons) {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-content :global(.cta-button) {
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
  }
  
  .section-content :global(.cta-button.primary) {
    background: #6366f1;
    color: white;
  }
  
  .section-content :global(.cta-button.primary:hover) {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  }
  
  .section-content :global(.cta-button.secondary) {
    background: white;
    color: #6366f1;
    border: 2px solid #6366f1;
  }
  
  .section-content :global(.cta-button.secondary:hover) {
    background: #6366f1;
    color: white;
    transform: translateY(-2px);
  }
  
  /* Alternating alignment */
  .story-section.right .section-content {
    margin-left: auto;
    margin-right: 0;
  }
  
  @media (min-width: 1024px) {
    .story-section.left .section-header {
      text-align: left;
      padding-left: 15%;
    }
    
    .story-section.right .section-header {
      text-align: right;
      padding-right: 15%;
    }
    
    .story-section.left .section-content {
      padding-left: 15%;
    }
    
    .story-section.right .section-content {
      padding-right: 15%;
    }
  }
  
  @media (max-width: 768px) {
    .section-header h2 {
      font-size: 2rem;
    }
    
    .section-content {
      font-size: 1rem;
      padding: 0 1rem;
    }
    
    .section-content :global(.cta-section) {
      padding: 2rem 1.5rem;
    }
  }
</style>