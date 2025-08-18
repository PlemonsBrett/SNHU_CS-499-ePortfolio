<script>
  import { siteConfig } from '../config/site.js';
  
  export let currentPath = "";

  const posts = siteConfig.projects.liarsDice.sections;

  $: isActive = (path) => currentPath === path;
</script>

<aside class="blog-sidebar">
  <div class="sidebar-header">
    <a href="/projects/liarsdice"><h3>🎲 Liar's Dice Review</h3></a>
    <p class="subtitle">CS-499 Capstone Enhancement</p>
  </div>

  <nav class="sidebar-nav">
    {#each posts as post, index}
      <a
        href={post.path}
        class="nav-item"
        class:active={isActive(post.path)}
        aria-current={isActive(post.path) ? "page" : undefined}
      >
        <span class="part-number">Part {index + 1}</span>
        <span class="part-title">{post.title.replace(/Part \d: /, "")}</span>
        <span class="part-description">{post.description}</span>
      </a>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <div class="external-links">
      <a
        href={siteConfig.projects.liarsDice.github}
        target="_blank"
        rel="noopener noreferrer"
        class="external-link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        GitHub Repository
      </a>
      <a
        href={siteConfig.projects.liarsDice.docs}
        target="_blank"
        rel="noopener noreferrer"
        class="external-link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
          />
        </svg>
        Documentation
      </a>
    </div>
  </div>
</aside>

<style>
  .blog-sidebar {
    position: sticky;
    top: 5rem;
    width: 280px;
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e1e4e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: fit-content;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
  }

  .sidebar-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e1e4e8;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #666666;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .nav-item:hover {
    background: #f8f9fa;
    border-color: #e1e4e8;
  }

  .nav-item.active {
    background: rgba(0, 122, 204, 0.08);
    border-color: var(--accent-color, #007acc);
  }

  .part-number {
    font-size: 0.75rem;
    color: var(--accent-color, #007acc);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .part-title {
    font-size: 0.95rem;
    color: #1a1a1a;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  .active .part-title {
    color: var(--accent-color, #007acc);
  }

  .part-description {
    font-size: 0.8rem;
    color: #666666;
    margin-top: 0.25rem;
  }

  .sidebar-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e4e8;
  }

  .external-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .external-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    text-decoration: none;
    color: #666666;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .external-link:hover {
    background: #f8f9fa;
    color: #1a1a1a;
  }

  .external-link svg {
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    .blog-sidebar {
      display: none;
    }
  }
</style>
