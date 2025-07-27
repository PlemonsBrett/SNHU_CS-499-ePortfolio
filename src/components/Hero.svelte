<script>
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import emblaCarouselSvelte from 'embla-carousel-svelte'
  import Autoplay from 'embla-carousel-autoplay'
  
  let visible = $state(false)
  let titleVisible = $state(false)
  let subtitleVisible = $state(false)
  let emblaApi = $state(null)
  let selectedIndex = $state(0)
  
  const titles = [
    'Engineering Manager',
    'Machine Learning Engineer',
    'Systems Architect',
    'Team Leader',
    'Problem Solver'
  ]
  
  // Embla carousel options
  const emblaOptions = {
    align: 'center',
    loop: true,
    skipSnaps: false,
    containScroll: false // Allow infinite scrolling
  }
  
  // Autoplay plugin options
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    playOnInit: true,
    stopOnLastSnap: false // Don't stop at the end
  }
  
  onMount(() => {
    console.log('Hero component mounted')
    visible = true
    setTimeout(() => titleVisible = true, 300)
    setTimeout(() => subtitleVisible = true, 600)
  })
  
  // Handle carousel initialization
  function onInit(event) {
    console.log('onInit called', event)
    if (event && event.detail) {
      // The detail object contains all the Embla methods
      const api = event.detail
      console.log('Embla detail:', api)
      
      // Check if we have the necessary methods
      if (api && api.slidesInView && api.on) {
        emblaApi = api
        
        // Debug: Check what Embla sees
        console.log('Total slides:', api.slideNodes().length)
        console.log('Scroll snaps:', api.scrollSnapList())
        console.log('Selected snap:', api.selectedScrollSnap())
        
        // Function to update selected slide based on Embla's selection
        const updateCenteredSlide = () => {
          // Use Embla's selected snap directly
          const selectedSnap = api.selectedScrollSnap()
          
          if (selectedSnap !== selectedIndex) {
            selectedIndex = selectedSnap
            console.log('Selected snap:', selectedSnap, 'title:', titles[selectedIndex])
          }
        }
        
        // Listen to scroll events
        api.on('scroll', updateCenteredSlide)
        api.on('select', updateCenteredSlide)
        
        // Set initial selected index
        updateCenteredSlide()
      }
    }
  }
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
          
          <div 
            class="embla"
            use:emblaCarouselSvelte={{ 
              options: emblaOptions, 
              plugins: [
                Autoplay(autoplayOptions)
              ]
            }}
            onemblaInit={onInit}
          >
            <div class="embla__container">
              {#each titles as title, i}
                <div class="embla__slide" class:is-selected={selectedIndex === i}>
                  <span class="dynamic-title">
                    {title}
                  </span>
                </div>
              {/each}
            </div>
          </div>
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
    padding: 8rem 2rem;
    margin: 0 calc(-50vw + 50%);
    width: 100vw;
    overflow: hidden;
    background: #0f172a;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 5rem;
    margin: 0;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }
  
  .subtitle-container {
    margin: 2rem 0 3rem;
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
    color: #94a3b8;
    font-weight: 400;
  }
  
  /* Embla Carousel Styles */
  .embla {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    overflow: hidden;
    
    /* Fade edges */
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    );
  }
  
  .embla__container {
    display: flex;
    align-items: center;
    height: 5rem;
  }
  
  .embla__slide {
    flex: 0 0 33.333%;
    min-width: 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .dynamic-title {
    font-size: 2rem;
    font-weight: 600;
    white-space: nowrap;
    color: #64748b;
    transition: all 0.5s ease;
    transform: scale(0.8);
    opacity: 0.6;
  }
  
  /* Focus styling for selected slides */
  .embla__slide.is-selected .dynamic-title {
    color: #60a5fa;
    transform: scale(1);
    opacity: 1;
    text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
  }
  
  /* Center highlight effect */
  .embla::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.1) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2.5rem;
  }
  
  .cta-button {
    padding: 0.875rem 2.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
    font-size: 1.125rem;
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
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    top: -300px;
    left: -300px;
    animation-delay: 0s;
  }
  
  .orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
    bottom: -250px;
    right: -250px;
    animation-delay: 7s;
  }
  
  .orb-3 {
    width: 400px;
    height: 400px;
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
    .hero {
      padding: 5rem 1.5rem;
    }
    
    h1 {
      font-size: 3rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
    }
    
    .dynamic-title {
      font-size: 1.5rem;
    }
    
    .embla__slide {
      flex: 0 0 100%;
    }
    
    .embla__container {
      height: 4rem;
    }
    
    .cta-button {
      font-size: 1rem;
      padding: 0.75rem 2rem;
    }
  }
</style>