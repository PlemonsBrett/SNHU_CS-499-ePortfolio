<script>
const {
  filters = {},
  selectedFilters = {},
  onFilterChange = () => {},
  projects = []
} = $props()

// Group filters by category
const filterCategories = Object.entries(filters)

// Count occurrences of each filter value
function getFilterCount(category, value) {
  return projects.filter(project => {
    const projectValue = project[category]
    if (Array.isArray(projectValue)) {
      return projectValue.includes(value)
    }
    return projectValue === value
  }).length
}

function toggleFilter(category, value) {
  const currentFilters = selectedFilters[category] || []
  const isSelected = currentFilters.includes(value)
  
  const newFilters = {
    ...selectedFilters,
    [category]: isSelected
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value]
  }
  
  // Remove empty arrays
  if (newFilters[category].length === 0) {
    delete newFilters[category]
  }
  
  onFilterChange(newFilters)
}

function clearAllFilters() {
  onFilterChange({})
}

function hasActiveFilters() {
  return Object.keys(selectedFilters).length > 0
}
</script>

<aside class="filter-sidebar">
  <div class="filter-header">
    <h2>Filters</h2>
    {#if hasActiveFilters()}
      <button onclick={clearAllFilters} class="clear-button">
        Clear all
      </button>
    {/if}
  </div>
  
  {#each filterCategories as [category, values]}
    <div class="filter-section">
      <h3 class="filter-category">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <div class="filter-options">
        {#each values as value}
          {@const isSelected = selectedFilters[category]?.includes(value)}
          <label class="filter-option" class:selected={isSelected}>
            <input
              type="checkbox"
              checked={isSelected}
              onchange={() => toggleFilter(category, value)}
            />
            <span class="filter-label">{value}</span>
            <span class="filter-count">
              ({getFilterCount(category, value)})
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/each}
</aside>

<style>
  .filter-sidebar {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .filter-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .clear-button {
    font-size: 0.875rem;
    color: #007acc;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: background 0.2s ease;
  }
  
  .clear-button:hover {
    background: #eef2ff;
  }
  
  .filter-section {
    margin-bottom: 2rem;
  }
  
  .filter-section:last-child {
    margin-bottom: 0;
  }
  
  .filter-category {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.75rem;
  }
  
  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .filter-option:hover {
    background: #f9fafb;
  }
  
  .filter-option.selected {
    background: #eef2ff;
    color: #007acc;
  }
  
  .filter-option input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: #007acc;
  }
  
  .filter-label {
    flex: 1;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .filter-option.selected .filter-label {
    color: #007acc;
    font-weight: 500;
  }
  
  .filter-count {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  /* Custom scrollbar */
  .filter-sidebar::-webkit-scrollbar {
    width: 6px;
  }
  
  .filter-sidebar::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  .filter-sidebar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .filter-sidebar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .filter-sidebar {
      position: static;
      max-height: none;
      margin-bottom: 2rem;
    }
  }
</style>