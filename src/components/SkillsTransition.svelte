<script>
  import { onMount } from "svelte";

  const { skills: _skills = [], id = "" } = $props();

  let _mounted = $state(false);

  onMount(async () => {
    _mounted = true;
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");

    gsap.registerPlugin(ScrollTrigger);

    // Animate skills flying upward
    const skillElements = document.querySelectorAll(`#${id} .skill-item`);

    // Position skills randomly across the viewport
    skillElements.forEach((el, i) => {
      gsap.set(el, {
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotation: Math.random() * 30 - 15,
        left: `${10 + (i % 5) * 18}%`,
        top: `${60 + Math.floor(i / 5) * 15}%`,
      });
    });

    gsap.to(skillElements, {
      opacity: 1,
      y: -600,
      scale: 1,
      rotation: 0,
      duration: 2,
      stagger: {
        each: 0.1,
        from: "random",
      },
      ease: "power2.out",
      scrollTrigger: {
        trigger: `#${id}`,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Keep skills visible until timeline appears
    // Find the next timeline element
    const nextTimeline = document.querySelector(`#${id} ~ .career-timeline`);
    if (nextTimeline) {
      gsap.to(skillElements, {
        opacity: 0,
        scrollTrigger: {
          trigger: nextTimeline,
          start: "top bottom",
          end: "top 80%",
          scrub: 1,
        },
      });
    } else {
      // Fallback if no timeline found
      gsap.to(skillElements, {
        opacity: 0,
        scrollTrigger: {
          trigger: `#${id}`,
          start: "bottom 20%",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  });
</script>

<section {id} class="skills-transition">
  {#if _mounted}
    <div class="skills-container">
      {#each _skills as skill, i}
        <div class="skill-item" style="--delay: {i * 0.1}s">
          {skill}
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .skills-transition {
    position: relative;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skills-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
  }

  .skill-item {
    position: absolute;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 1.125rem;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .skill-item {
      font-size: 0.875rem;
      padding: 0.75rem 1.5rem;
    }
  }
</style>
