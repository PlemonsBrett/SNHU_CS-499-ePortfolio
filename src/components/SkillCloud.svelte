<script>
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  
  let visible = false
  
  const skills = [
    { name: 'Python', level: 'expert', category: 'language' },
    { name: 'TypeScript', level: 'expert', category: 'language' },
    { name: 'C++', level: 'intermediate', category: 'language' },
    { name: 'AWS', level: 'expert', category: 'cloud' },
    { name: 'Machine Learning', level: 'advanced', category: 'ml' },
    { name: 'System Architecture', level: 'expert', category: 'design' },
    { name: 'Team Leadership', level: 'expert', category: 'soft' },
    { name: 'Data Engineering', level: 'expert', category: 'data' },
    { name: 'MLOps', level: 'advanced', category: 'ml' },
    { name: 'React', level: 'advanced', category: 'frontend' },
    { name: 'Svelte', level: 'intermediate', category: 'frontend' },
    { name: 'Docker', level: 'advanced', category: 'devops' },
    { name: 'Kubernetes', level: 'intermediate', category: 'devops' },
    { name: 'TensorFlow', level: 'intermediate', category: 'ml' },
    { name: 'Agile', level: 'expert', category: 'methodology' }
  ]
  
  const categoryColors = {
    language: '#3b82f6',
    cloud: '#10b981',
    ml: '#8b5cf6',
    design: '#f59e0b',
    soft: '#ef4444',
    data: '#06b6d4',
    frontend: '#ec4899',
    devops: '#14b8a6',
    methodology: '#6366f1'
  }
  
  const sizeMap = {
    expert: 'large',
    advanced: 'medium',
    intermediate: 'small'
  }
  
  onMount(() => {
    visible = true
  })
</script>

{#if visible}
  <div class="skill-cloud" transition:fade={{ duration: 500 }}>
    {#each skills as skill, index}
      <span 
        class="skill-tag {sizeMap[skill.level]}"
        style="
          background-color: {categoryColors[skill.category]}20;
          color: {categoryColors[skill.category]};
          border-color: {categoryColors[skill.category]};
          animation-delay: {index * 0.1}s;
        "
      >
        {skill.name}
      </span>
    {/each}
  </div>
{/if}

<style>
  .skill-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
    padding: 2rem;
  }
  
  .skill-tag {
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    border: 2px solid;
    font-weight: 600;
    animation: fadeInScale 0.5s ease-out forwards;
    opacity: 0;
    transform: scale(0.8);
    transition: transform 0.2s ease;
  }
  
  .skill-tag:hover {
    transform: scale(1.1);
  }
  
  .skill-tag.large {
    font-size: 1.25rem;
    padding: 0.75rem 1.5rem;
  }
  
  .skill-tag.medium {
    font-size: 1rem;
  }
  
  .skill-tag.small {
    font-size: 0.875rem;
    padding: 0.375rem 0.875rem;
  }
  
  @keyframes fadeInScale {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (max-width: 768px) {
    .skill-cloud {
      gap: 0.75rem;
      padding: 1rem;
    }
    
    .skill-tag.large {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
    
    .skill-tag.medium {
      font-size: 0.875rem;
    }
    
    .skill-tag.small {
      font-size: 0.75rem;
    }
  }
</style>