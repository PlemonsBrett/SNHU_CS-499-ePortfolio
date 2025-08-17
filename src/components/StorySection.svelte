<script>
const { id = '', chapter = '', title = '', subtitle = '', align = 'left', children } = $props()
</script>

<section 
  {id}
  class="story-section {align}"
>
  {#if chapter}
    <div class="chapter-intro">
      <span class="big-chapter">Chapter {chapter}</span>
    </div>
  {/if}
  
  <div class="section-header">
    <span class="chapter-number">Chapter {chapter}</span>
    <h2>{title}</h2>
    <p class="subtitle">{subtitle}</p>
  </div>
  
  <div class="section-content">
    {@render children?.()}
  </div>
</section>

<style>
  .story-section {
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
    min-height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 10vh; /* Add space between sections */
  }
  
  #chapter-01 {
    margin-top: 0; /* No margin for chapter 01 */
  }
  
  #chapter-02 {
    margin-top: 5vh; /* Smaller margin after timeline */
  }
  
  
  .chapter-intro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    z-index: 10;
    pointer-events: none;
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
    margin-bottom: 2rem;
    opacity: 0;
  }
  
  .chapter-number {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #007acc;
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
    opacity: 0;
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
    background: #007acc;
    color: white;
  }
  
  .section-content :global(.cta-button.primary:hover) {
    background: #0062a3;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 122, 204, 0.3);
  }
  
  .section-content :global(.cta-button.secondary) {
    background: white;
    color: #007acc;
    border: 2px solid #007acc;
  }
  
  .section-content :global(.cta-button.secondary:hover) {
    background: #007acc;
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
      max-width: 800px;
      margin: 0 auto 2rem 15%;
    }
    
    .story-section.left .section-content {
      max-width: 800px;
      margin: 0 15% 0 auto;
    }
    
    .story-section.right .section-header {
      text-align: right;
      max-width: 800px;
      margin: 0 15% 2rem auto;
    }
    
    .story-section.right .section-content {
      max-width: 800px;
      margin: 0 auto 0 15%;
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
      min-height: auto;
      padding: 3rem 0;
      margin-top: 5vh;
    }
  }
</style>