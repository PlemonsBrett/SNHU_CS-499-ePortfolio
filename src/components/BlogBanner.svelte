<script>
export let title = ''
export let subtitle = ''
export let partNumber = ''
export let gradientFrom = '#2563eb' // blue-600
export let gradientTo = '#06b6d4' // cyan-600
</script>

<div class="blog-banner">
  <div class="banner-content">
    {#if partNumber}
      <div class="part-number">Part {partNumber}</div>
    {/if}
    <h1 class="banner-title">{title}</h1>
    {#if subtitle}
      <p class="banner-subtitle">{subtitle}</p>
    {/if}
  </div>
  <div class="banner-gradient" style="background: linear-gradient(to bottom right, {gradientFrom}, {gradientTo});"></div>
</div>

<style>
  .blog-banner {
    position: relative;
    width: 100%;
    padding: 4rem 2rem;
    margin-bottom: 3rem;
    overflow: hidden;
    border-radius: 1rem;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .banner-gradient {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    z-index: 0;
  }

  .banner-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .part-number {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #007acc;
    color: white;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .banner-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  .banner-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .blog-banner {
      padding: 3rem 1.5rem;
      margin-bottom: 2rem;
    }

    .banner-title {
      font-size: 1.875rem;
    }

    .banner-subtitle {
      font-size: 1rem;
    }
  }
</style>