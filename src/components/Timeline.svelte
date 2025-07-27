<script>
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  
  let visible = false
  let visibleItems = []
  
  const timeline = [
    {
      year: '2014',
      title: 'Full Stack Software Engineer',
      description: 'Started my journey as a self-taught developer',
      icon: '💻'
    },
    {
      year: '2016',
      title: 'Data Engineer',
      description: 'Dove deep into data pipelines and system optimization',
      icon: '📊'
    },
    {
      year: '2018',
      title: 'Senior Software Engineer',
      description: 'Led technical initiatives and mentored team members',
      icon: '🚀'
    },
    {
      year: '2020',
      title: 'Software Engineering Manager',
      description: 'Transitioned to leadership, building high-performing teams',
      icon: '👥'
    },
    {
      year: '2025',
      title: 'Machine Learning Engineer',
      description: 'Combining systems expertise with AI/ML capabilities',
      icon: '🤖'
    }
  ]
  
  onMount(() => {
    visible = true
    timeline.forEach((_, index) => {
      setTimeout(() => {
        visibleItems = [...visibleItems, index]
      }, 200 * index)
    })
  })
</script>

{#if visible}
  <div class="timeline-container" transition:fade={{ duration: 500 }}>
    <div class="timeline-line"></div>
    {#each timeline as item, index}
      {#if visibleItems.includes(index)}
        <div 
          class="timeline-item"
          class:left={index % 2 === 0}
          class:right={index % 2 === 1}
          transition:fly={{ x: index % 2 === 0 ? -50 : 50, duration: 500 }}
        >
          <div class="timeline-content">
            <div class="timeline-icon">{item.icon}</div>
            <div class="timeline-year">{item.year}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <div class="timeline-dot"></div>
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .timeline-container {
    position: relative;
    max-width: 1000px;
    margin: 3rem auto;
    padding: 2rem 0;
  }
  
  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
    transform: translateX(-50%);
  }
  
  .timeline-item {
    position: relative;
    width: 50%;
    padding: 0 2rem;
    margin-bottom: 3rem;
  }
  
  .timeline-item.left {
    left: 0;
    text-align: right;
  }
  
  .timeline-item.right {
    left: 50%;
    text-align: left;
  }
  
  .timeline-content {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .timeline-content:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .timeline-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .timeline-year {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .timeline-content h3 {
    margin: 0 0 0.5rem;
    color: #1f2937;
    font-size: 1.25rem;
  }
  
  .timeline-content p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .timeline-dot {
    position: absolute;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    top: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .timeline-item.left .timeline-dot {
    right: -8px;
  }
  
  .timeline-item.right .timeline-dot {
    left: -8px;
  }
  
  @media (max-width: 768px) {
    .timeline-line {
      left: 2rem;
    }
    
    .timeline-item {
      width: 100%;
      padding-left: 4rem;
      text-align: left !important;
    }
    
    .timeline-item.right {
      left: 0;
    }
    
    .timeline-dot {
      left: 24px !important;
      right: auto !important;
    }
  }
</style>