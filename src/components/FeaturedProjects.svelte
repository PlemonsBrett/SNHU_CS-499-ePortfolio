<script>
import ProjectCard from './ProjectCard.svelte'
import { getFeaturedProjects } from '../data/projects'

const featuredProjects = getFeaturedProjects()
</script>

<section class="featured-projects">
  <div class="section-header">
    <h2 class="section-title">Featured Projects</h2>
    <p class="section-description">
      Explore some of my recent work across different domains
    </p>
  </div>
  
  <div class="projects-grid">
    {#each featuredProjects as project}
      <ProjectCard {...project} />
    {/each}
  </div>
  
  <div class="view-all">
    <a href="/projects" class="view-all-link">
      View All Projects
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  </div>
</section>

<style>
  .featured-projects {
    padding: 4rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 1rem;
  }
  
  .section-description {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .view-all {
    text-align: center;
  }
  
  .view-all-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: #6366f1;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .view-all-link:hover {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  }
  
  .view-all-link svg {
    transition: transform 0.2s ease;
  }
  
  .view-all-link:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: 1024px) {
    .featured-projects {
      padding: 3rem 1.5rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .projects-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 640px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style>