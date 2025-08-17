<script>
const {
  title,
  description,
  image,
  imageAlt = '',
  tags = [],
  link = '#',
  github = '',
  demo = ''
} = $props()
</script>

<article class="project-card">
  <a href={link} class="card-link">
    <div class="card-image">
      {#if image}
        <img src={image} alt={imageAlt || title} loading="lazy" />
      {:else}
        <div class="placeholder-image">
          <span>📁</span>
        </div>
      {/if}
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{title}</h3>
      <p class="card-description">{description}</p>
      
      <div class="card-tags">
        {#each tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    </div>
  </a>
  
  {#if github || demo}
    <div class="card-actions">
      {#if github}
        <a href={github} target="_blank" rel="noopener noreferrer" class="action-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Code
        </a>
      {/if}
      {#if demo}
        <a href={demo} target="_blank" rel="noopener noreferrer" class="action-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Demo
        </a>
      {/if}
    </div>
  {/if}
</article>

<style>
  .project-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .card-link {
    text-decoration: none;
    color: inherit;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f3f4f6;
  }
  
  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .project-card:hover .card-image img {
    transform: scale(1.05);
  }
  
  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  }
  
  .placeholder-image span {
    font-size: 3rem;
    opacity: 0.5;
  }
  
  .card-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.75rem;
    line-height: 1.4;
  }
  
  .card-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 1rem;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }
  
  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: #eef2ff;
    color: #007acc;
    border-radius: 9999px;
    font-weight: 500;
  }
  
  .card-actions {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    gap: 1rem;
  }
  
  .action-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .action-link:hover {
    color: #007acc;
  }
  
  .action-link svg {
    flex-shrink: 0;
  }
  
  @media (max-width: 640px) {
    .card-image {
      height: 160px;
    }
    
    .card-content {
      padding: 1.25rem;
    }
    
    .card-title {
      font-size: 1.125rem;
    }
  }
</style>