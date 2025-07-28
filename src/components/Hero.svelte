<script>
  import { fade } from 'svelte/transition'
  let visible = false
  
  $: if (typeof window !== 'undefined') {
    visible = true
  }
</script>

{#if visible}
  <section class="hero" transition:fade={{ duration: 500 }}>
    <h1>Brett Plemons</h1>
    <p class="subtitle">AI Engineering Portfolio</p>
    <p class="description">
      Exploring the intersection of software engineering and artificial intelligence
    </p>
  </section>
{/if}

<style>
  .hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 1rem;
    margin-bottom: 3rem;
  }
  
  h1 {
    font-size: 3rem;
    margin: 0;
    font-weight: 800;
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    opacity: 0.9;
  }
  
  .description {
    font-size: 1.125rem;
    margin: 1rem 0 0;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    .subtitle {
      font-size: 1.25rem;
    }
  }
</style>