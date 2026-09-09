<script>
import { onMount } from 'svelte'

const { events: _events = [], id = '' } = $props()

onMount(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  // Animate timeline line. Centering uses left/margin, so GSAP can own transform.
  const line = document.querySelector(`#${id} .timeline-line`)
  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      duration: 1,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top 80%',
        once: true,
      },
    }
  )

  // Animate cards only so dots stay locked to the center line
  const eventContents = document.querySelectorAll(`#${id} .event-content`)
  gsap.fromTo(
    eventContents,
    {
      opacity: 0,
      x: (index) => (index % 2 === 0 ? -50 : 50),
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top 75%',
        once: true,
      },
    }
  )
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
    margin-bottom: 10vh; /* Add space after timeline */
  }

  .timeline-container {
    position: relative;
    box-sizing: border-box;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  .timeline-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
    background: linear-gradient(180deg, #007acc 0%, #0062a3 100%);
    transform-origin: top;
  }

  /* Keep the row exactly container-width so left: 50% on the dot matches the line.
     Padding on this row would expand a content-box width: 100% and shift the dots. */
  .timeline-event {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 3rem;
  }

  .timeline-event.left {
    text-align: right;
  }

  .timeline-event.right {
    text-align: left;
  }

  .event-dot {
    position: absolute;
    top: 1.75rem;
    left: 50%;
    z-index: 1;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    background: #007acc;
    border: 4px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(0, 122, 204, 0.2);
  }

  .event-content {
    box-sizing: border-box;
    width: calc(50% - 2rem);
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .timeline-event.left .event-content {
    margin-right: auto;
  }

  .timeline-event.right .event-content {
    margin-left: auto;
  }

  .event-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .event-date {
    font-size: 0.875rem;
    color: #007acc;
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
      margin-left: -1px;
    }

    .timeline-event.left,
    .timeline-event.right {
      text-align: left;
    }

    .timeline-event.left .event-content,
    .timeline-event.right .event-content {
      width: calc(100% - 3rem);
      margin-left: 3rem;
      margin-right: 0;
    }

    .event-dot {
      left: 20px;
      margin-left: -10px;
    }
  }
</style>
