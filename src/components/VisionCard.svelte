<script>
const { title = 'My Next Chapter', goal = '', subtitle = 'Combining:', items = [] } = $props()
</script>

<div class="vision-card">
  <div class="vision-header">
    <h2 class="vision-title">{title}</h2>
    <h3 class="vision-goal">{goal}</h3>
  </div>
  
  {#if subtitle || items.length > 0}
    <div class="vision-content">
      {#if subtitle}
        <p class="vision-subtitle">{subtitle}</p>
      {/if}
      
      {#if items.length > 0}
        <ul class="vision-items">
          {#each items as item}
            <li class="vision-item">
              <span class="item-icon">{item.icon}</span>
              <span class="item-text">{item.text}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  .vision-card {
    position: relative;
    margin: 4rem auto;
    max-width: 900px;
    padding: 3rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    color: white;
    overflow: hidden;
    transform: translateY(0);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .vision-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.3; }
  }
  
  .vision-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }
  
  .vision-header {
    position: relative;
    text-align: center;
    margin-bottom: 2.5rem;
    z-index: 1;
  }
  
  .vision-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.9;
    margin-bottom: 0.75rem;
  }
  
  .vision-goal {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.3;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  .vision-content {
    position: relative;
    z-index: 1;
  }
  
  .vision-subtitle {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }
  
  .vision-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .vision-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }
  
  .vision-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
  
  .item-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  .item-text {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.95;
  }
  
  @media (max-width: 768px) {
    .vision-card {
      margin: 2rem 1rem;
      padding: 2rem 1.5rem;
    }
    
    .vision-goal {
      font-size: 1.5rem;
    }
    
    .vision-items {
      gap: 0.75rem;
    }
    
    .vision-item {
      padding: 0.5rem;
      gap: 0.75rem;
    }
    
    .item-icon {
      font-size: 1.25rem;
    }
    
    .item-text {
      font-size: 0.875rem;
    }
  }
  
  @media (min-width: 1024px) {
    .vision-card {
      padding: 4rem;
    }
    
    .vision-goal {
      font-size: 2.5rem;
    }
  }
</style>