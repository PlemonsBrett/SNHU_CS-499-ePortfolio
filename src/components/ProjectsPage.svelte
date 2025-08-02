<script>
import ProjectGrid from './ProjectGrid.svelte'
import FilterSidebar from './FilterSidebar.svelte'

const { projects = [], filters = {} } = $props()

let selectedFilters = $state({})

function handleFilterChange(newFilters) {
  selectedFilters = newFilters
}
</script>

<div class="projects-container">
  <aside class="sidebar">
    <FilterSidebar 
      {filters}
      {selectedFilters}
      {projects}
      onFilterChange={handleFilterChange}
    />
  </aside>
  
  <main class="main-content">
    <ProjectGrid 
      {projects}
      {selectedFilters}
    />
  </main>
</div>

<style>
  .projects-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
  }
  
  .sidebar {
    position: relative;
  }
  
  .main-content {
    min-width: 0; /* Prevent grid overflow */
  }
  
  @media (max-width: 1024px) {
    .projects-container {
      grid-template-columns: 240px 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .projects-container {
      grid-template-columns: 1fr;
    }
  }
</style>