<script>
  export let currentPath = "";

  const posts = [
    {
      title: "Overview",
      path: "/projects/liarsdice",
      part: 0,
    },
    {
      title: "Software Engineering & Design",
      path: "/projects/liarsdice/software-engineering",
      part: 1,
    },
    {
      title: "Databases",
      path: "/projects/liarsdice/databases",
      part: 2,
    },
    {
      title: "Algorithms & Data Structures",
      path: "/projects/liarsdice/algorithms",
      part: 3,
    },
    {
      title: "Professional Assessment",
      path: "/projects/liarsdice/professional-assessment",
      part: 4,
    },
  ];

  $: currentIndex = posts.findIndex((p) => p.path === currentPath);
  $: previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  $: nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
</script>

<nav class="blog-navigation">
  <div class="nav-container">
    {#if previousPost}
      <a href={previousPost.path} class="nav-link prev">
        <span class="nav-arrow">←</span>
        <div class="nav-content">
          <span class="nav-label">Previous Part</span>
          <span class="nav-title"
            >Part {previousPost.part}: {previousPost.title}</span
          >
        </div>
      </a>
    {:else}
      <div class="nav-placeholder"></div>
    {/if}

    {#if nextPost}
      <a href={nextPost.path} class="nav-link next">
        <div class="nav-content">
          <span class="nav-label">Next Part</span>
          <span class="nav-title">Part {nextPost.part}: {nextPost.title}</span>
        </div>
        <span class="nav-arrow">→</span>
      </a>
    {:else}
      <div class="nav-placeholder"></div>
    {/if}
  </div>
</nav>

<style>
  .blog-navigation {
    margin: 3rem 0;
    padding: 2rem 0;
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    width: 100%;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    background: #f8f9fa;
    border: 1px solid #e1e4e8;
    transition: all 0.3s ease;
    max-width: 400px;
  }

  .nav-link:hover {
    background: #f0f1f3;
    border-color: var(--accent-color, #007acc);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .nav-link.prev {
    justify-content: flex-start;
    margin-right: auto;
  }

  .nav-link.next {
    justify-content: flex-end;
    margin-left: auto;
  }

  .nav-placeholder {
    flex: 1;
  }

  .nav-arrow {
    font-size: 1.5rem;
    color: var(--accent-color, #007acc);
    display: flex;
    align-items: center;
  }

  .nav-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-link.prev .nav-content {
    text-align: left;
  }

  .nav-link.next .nav-content {
    text-align: right;
  }

  .nav-label {
    font-size: 0.75rem;
    color: #666666;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .nav-title {
    font-size: 1rem;
    color: #1a1a1a;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
    }

    .nav-link {
      max-width: 100%;
    }

    .nav-link.next {
      margin-left: 0;
    }
  }
</style>
