<script>
import { onMount } from 'svelte'

const { events: _events = [], id = '' } = $props()

onMount(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  // Animate timeline line
  const line = document.querySelector(`#${id} .timeline-line`)
  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      duration: 1,
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
    }
  )

  // Animate timeline events
  const eventElements = document.querySelectorAll(`#${id} .timeline-event`)
  gsap.fromTo(
    eventElements,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.2,
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top 70%',
        end: 'bottom 70%',
        scrub: 1,
      },
    }
  )

  // Fade out the entire timeline
  gsap.to(`#${id}`, {
    opacity: 0,
    scrollTrigger: {
      trigger: `#${id}`,
      start: 'bottom 30%',
      end: 'bottom top',
      scrub: 1,
    },
  })
})
</script>

<section {id} class="career-timeline">
  <div class="timeline-container">
    <div class="timeline-line"></div>
    {#each _events as event, i}
      <div class="timeline-event {i % 2 === 0 ? 'left' : 'right'}">
        <div class="event-dot"></div>
        <div class="event-content">
          <div class="event-date">{event.date}</div>
          <div class="event-title">{event.title}</div>
          <div class="event-company">{event.company}</div>
          {#if event.description}
            <div class="event-description">{event.description}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .career-timeline {
    position: relative;
    padding: 5rem 2rem 2rem;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
  }

  .timeline-container {
    position: relative;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
    transform-origin: top;
  }

  .timeline-event {
    position: relative;
    width: 45%;
    margin-bottom: 3rem;
  }

  .timeline-event.left {
    left: 0;
    text-align: right;
  }

  .timeline-event.right {
    left: 55%;
    text-align: left;
  }

  .event-dot {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #6366f1;
    border: 4px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  .timeline-event.left .event-dot {
    right: -12.5%;
  }

  .timeline-event.right .event-dot {
    left: -12.5%;
  }

  .event-content {
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .event-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .event-date {
    font-size: 0.875rem;
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .event-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .event-company {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .event-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .timeline-line {
      left: 20px;
    }

    .timeline-event {
      width: calc(100% - 40px);
      left: 40px !important;
      text-align: left !important;
    }

    .event-dot {
      left: -30px !important;
      right: auto !important;
    }
  }
</style>
