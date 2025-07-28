<script>
  let { 
    align = 'left', // 'left' or 'right'
    title = 'Achievements'
  } = $props()
</script>

<div class="achievements-card {align}">
  <h3 class="achievements-title">{title}</h3>
  <div class="achievements-list">
    <slot />
  </div>
</div>

<style>
  .achievements-card {
    position: relative;
    margin: 2rem auto;
    max-width: 600px;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .achievements-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  
  .achievements-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    padding-bottom: 1rem;
  }
  
  .achievements-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: #6366f1;
    border-radius: 2px;
  }
  
  .achievements-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .achievements-card {
      margin: 2rem 1rem;
      padding: 1.5rem;
    }
    
  }
  
</style>