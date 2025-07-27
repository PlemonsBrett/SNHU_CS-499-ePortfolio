<script>
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  
  export let id = ''
  export let chapter = ''
  export let title = ''
  export let subtitle = ''
  export let align = 'left'
  
  let visible = false
  let element
  let showChapter = false
  let showTitle = false
  let showContent = false
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true
          
          // Animate sequence for first chapter
          if (chapter === '01') {
            // Show chapter number first
            showChapter = true
            setTimeout(() => {
              showChapter = false
              // Then show title
              setTimeout(() => {
                showTitle = true
                // Finally show content
                setTimeout(() => {
                  showContent = true
                }, 800)
              }, 300)
            }, 1500)
          } else {
            // For other chapters, show normally
            showTitle = true
            setTimeout(() => showContent = true, 300)
          }
        }
      },
      { threshold: 0.3 }
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
  {id}
  bind:this={element}
  class="story-section {align}"
>
  {#if visible}
    {#if showChapter && chapter === '01'}
      <div class="chapter-intro" transition:fade={{ duration: 500 }}>
        <span class="big-chapter">Chapter {chapter}</span>
      </div>
    {/if}
    
    {#if showTitle}
      <div class="section-header" 
        class:centered={chapter === '01' && !showContent}
        transition:fly={{ y: showContent ? 0 : 50, duration: 600 }}
      >
        {#if chapter !== '01' || showContent}
          <span class="chapter-number">Chapter {chapter}</span>
        {/if}
        <h2>{title}</h2>
        <p class="subtitle">{subtitle}</p>
      </div>
    {/if}
    
    {#if showContent}
      <div class="section-content" transition:fade={{ delay: 300, duration: 600 }}>
        <slot />
      </div>
    {/if}
  {/if}
</section>

<style>
  .story-section {
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  
  .chapter-intro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .big-chapter {
    font-size: 5rem;
    font-weight: 200;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #1f2937;
    opacity: 0.8;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    transition: all 0.8s ease;
  }
  
  .section-header.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
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
    .big-chapter {
      font-size: 3rem;
    }
    
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
    
    .story-section {
      min-height: 100vh;
      padding: 3rem 0;
    }
  }
</style>