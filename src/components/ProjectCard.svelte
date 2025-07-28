<script>
  export let title = ''
  export let description = ''
  export let link = '#'
  
  let hovered = false
</script>

<article 
  class="card" 
  class:hovered
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  <a href={link}>
    <h3>{title}</h3>
    <p>{description}</p>
    <span class="read-more">Learn more →</span>
  </a>
</article>

<style>
  .card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
    height: 100%;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #9ca3af;
  }
  
  .card.hovered {
    border-color: #6366f1;
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  h3 {
    margin: 0 0 0.5rem;
    color: #1f2937;
    font-size: 1.25rem;
  }
  
  p {
    color: #6b7280;
    line-height: 1.6;
    flex: 1;
  }
  
  .read-more {
    color: #6366f1;
    font-weight: 500;
    font-size: 0.875rem;
    margin-top: 1rem;
    display: inline-block;
  }
</style>