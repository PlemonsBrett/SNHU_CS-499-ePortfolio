<script>
import { onMount } from 'svelte'
import { fade, fly } from 'svelte/transition'
import emblaCarouselSvelte from 'embla-carousel-svelte'
import Autoplay from 'embla-carousel-autoplay'

const { titles = ['Leader', 'Engineer', 'Architect', 'Mentor', 'Builder', 'Innovator'] } = $props()

let _visible = $state(false)
let _titleVisible = $state(false)
let _subtitleVisible = $state(false)
let _emblaApi = $state(null)
let selectedIndex = $state(0)

// Embla carousel options
const _emblaOptions = {
  align: 'center',
  loop: true,
  skipSnaps: false,
  containScroll: false, // Allow infinite scrolling
}

// Autoplay plugin options
const _autoplayOptions = {
  delay: 3000,
  stopOnInteraction: false,
  stopOnMouseEnter: true,
  playOnInit: true,
  stopOnLastSnap: false, // Don't stop at the end
}

onMount(() => {
  _visible = true
  setTimeout(() => {
    _titleVisible = true
  }, 300)
  setTimeout(() => {
    _subtitleVisible = true
  }, 600)
})

// Handle carousel initialization
function _onInit(event) {
  if (event?.detail) {
    // The detail object contains all the Embla methods
    const api = event.detail

    // Check if we have the necessary methods
    if (api?.slidesInView && api.on) {
      _emblaApi = api

      // Function to update selected slide based on Embla's selection
      const updateCenteredSlide = () => {
        // Use Embla's selected snap directly
        const selectedSnap = api.selectedScrollSnap()

        if (selectedSnap !== selectedIndex) {
          selectedIndex = selectedSnap
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

{#if _visible}
  <section class="hero" transition:fade={{ duration: 500 }}>
    <div class="hero-content">
      {#if _titleVisible}
        <h1 transition:fly={{ y: 20, duration: 500 }}>Brett Plemons</h1>
      {/if}

      {#if _subtitleVisible}
        <div
          class="subtitle-container"
          transition:fly={{ y: 20, duration: 500, delay: 200 }}
        >
          <p class="subtitle">Transforming Ideas Into Impact as a</p>

          <div
            class="embla"
            use:emblaCarouselSvelte={{
              options: _emblaOptions,
              plugins: [Autoplay(_autoplayOptions)],
            }}
            onemblaInit={_onInit}
          >
            <div class="embla__container">
              {#each titles as title, i}
                <div
                  class="embla__slide"
                  class:is-selected={selectedIndex === i}
                >
                  <span class="dynamic-title">
                    {title}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>

    {#if _subtitleVisible}
      <a
        href="#chapter-01"
        class="scroll-arrow"
        aria-label="Scroll to next section"
        transition:fly={{ y: 20, duration: 500, delay: 600 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </a>
    {/if}

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
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
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
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 150%;
    background: radial-gradient(
      ellipse at center,
      rgba(96, 165, 250, 0.1) 0%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 1;
  }

  .scroll-arrow {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: #60a5fa;
    text-decoration: none;
    animation: bounce 2s infinite;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  .scroll-arrow:hover {
    opacity: 0.8;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }

  .hero-background {
    position: absolute;
    inset: 0;
    z-index: 0;
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
    0%,
    100% {
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
      padding: 0;
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
  }
</style>
