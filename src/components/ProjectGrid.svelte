<script>
import ProjectCard from './ProjectCard.svelte'

const {
  projects = [],
  selectedFilters = {}
} = $props()

// Filter projects based on selected filters
const displayProjects = $derived.by(() => {
  console.log('Selected filters:', selectedFilters)
  console.log('Projects:', projects)
  
  if (Object.keys(selectedFilters).length === 0) {
    return projects
  }
  
  const filtered = projects.filter(project => {
    // Check if project matches ALL filter categories (AND logic between categories)
    return Object.entries(selectedFilters).every(([category, values]) => {
      // For each category, check if project has ANY of the selected values (OR logic within category)
      const projectValue = project[category]
      
      console.log(`Checking project ${project.title} for category ${category}:`, projectValue, 'against values:', values)
      
      if (Array.isArray(projectValue)) {
        // If project value is array (like tags), check if any overlap
        const hasMatch = values.some(value => projectValue.includes(value))
        console.log('Array match result:', hasMatch)
        return hasMatch
      } else {
        // If single value, check if it matches any selected value
        const hasMatch = values.includes(projectValue)
        console.log('Single value match result:', hasMatch)
        return hasMatch
      }
    })
  })
  
  console.log('Filtered projects:', filtered)
  return filtered
})
</script>

<div class="project-grid-container">
  {#if displayProjects.length === 0}
    <div class="no-results">
      <p class="no-results-text">No projects match your filters.</p>
      <p class="no-results-hint">Try adjusting your filter criteria.</p>
    </div>
  {:else}
    <div class="results-count">
      Showing {displayProjects.length} of {projects.length} projects
    </div>
    <div class="project-grid">
      {#each displayProjects as project}
        <ProjectCard {...project} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .project-grid-container {
    flex: 1;
  }
  
  .results-count {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
  
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }
  
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .no-results-text {
    font-size: 1.125rem;
    color: #374151;
    margin: 0 0 0.5rem;
  }
  
  .no-results-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
  
  @media (max-width: 1024px) {
    .project-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 640px) {
    .project-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>