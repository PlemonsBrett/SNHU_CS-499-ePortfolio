<script>
import { onMount } from 'svelte'

onMount(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  // Initial state - make sure hero is fully visible
  gsap.set('.hero', { opacity: 1 })

  // Hero fade out as you scroll (start later)
  gsap.fromTo(
    '.hero',
    { opacity: 1 },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: '70% top',
        end: '100% top',
        scrub: true,
      },
    }
  )

  // Hero content parallax
  gsap.to('.hero-content', {
    y: -150,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })

  // Hide scroll arrow as you scroll
  gsap.to('.scroll-arrow', {
    opacity: 0,
    y: -20,
    scrollTrigger: {
      trigger: '.hero',
      start: '10% top',
      end: '30% top',
      scrub: true,
    },
  })

  // Timeline section - just fade in
  const timeline = document.querySelector('.timeline-container')
  if (timeline) {
    gsap.fromTo(
      timeline,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    )
  }

  // Apply animations to all chapters
  const allChapters = document.querySelectorAll('.story-section[id^="chapter-"]')
  allChapters.forEach((section, index) => {
    // Handle big chapter animations for chapters 2+
    if (index > 0) {
      const bigChapter = section.querySelector('.big-chapter')
      if (bigChapter) {
        // Show chapter number during previous section fade
        gsap.fromTo(
          bigChapter,
          {
            opacity: 0,
            scale: 0.8,
            position: 'fixed',
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            zIndex: 100,
          },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 120%',
              end: 'top 100%',
              scrub: true,
            },
          }
        )

        // Fade out as we approach the actual section
        gsap.to(bigChapter, {
          opacity: 0,
          scale: 1.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            onComplete: () => {
              gsap.set(bigChapter, {
                position: 'absolute',
                top: 'auto',
                left: 'auto',
                xPercent: 0,
                yPercent: 0,
                zIndex: 1,
              })
            },
          },
        })
      }
    }

    // Animate header
    const header = section.querySelector('.section-header')
    if (header) {
      gsap.set(header, { opacity: 1 })
      gsap.from(header, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1,
        },
      })
    }

    // Animate content
    const content = section.querySelector('.section-content')
    if (content) {
      gsap.set(content, { opacity: 1 })
      gsap.from(content, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'top 20%',
          scrub: 1,
        },
      })
    }

    // Animate any stats or project grids
    const statsCards = section.querySelectorAll('.stat-card')
    if (statsCards.length > 0) {
      gsap.fromTo(
        statsCards,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section.querySelector('.stats-grid'),
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      )
    }
  })

  // Add special treatment for skills transitions
  const skillsTransitions = document.querySelectorAll('.skills-transition')
  skillsTransitions.forEach((transition) => {
    ScrollTrigger.create({
      trigger: transition,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        // Skills are animated by their own component
      },
    })
  })

  // Add timeline animations
  const timelines = document.querySelectorAll('.career-timeline')
  timelines.forEach((timeline) => {
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        // Timeline is animated by its own component
      },
    })
  })

  // Refresh ScrollTrigger after all animations are set up
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 100)

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
})
</script>
