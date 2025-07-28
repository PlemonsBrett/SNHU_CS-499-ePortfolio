<script>
const { icon = '🏆', metric = '', highlight = false, children } = $props()
</script>

<div class="achievement" class:highlight>
  <div class="achievement-icon">{icon}</div>
  <div class="achievement-content">
    {#if metric}
      <div class="achievement-metric">{metric}</div>
    {/if}
    <div class="achievement-description">
      {@render children?.()}
    </div>
  </div>
</div>

<style>
  .achievement {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
  }
  
  .achievement:hover {
    background-color: #f9fafb;
  }
  
  .achievement.highlight {
    background-color: #eef2ff;
    border-left: 4px solid #6366f1;
    padding-left: calc(1rem - 4px);
  }
  
  .achievement-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 0.5rem;
    font-size: 1.25rem;
  }
  
  .achievement.highlight .achievement-icon {
    background: #6366f1;
    color: white;
  }
  
  .achievement-content {
    flex: 1;
  }
  
  .achievement-metric {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  
  .achievement-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
  }
  
  /* Make description text darker for better readability */
  .achievement.highlight .achievement-description {
    color: #4b5563;
  }
  
  @media (max-width: 640px) {
    .achievement {
      gap: 0.75rem;
      padding: 0.75rem;
    }
    
    .achievement-icon {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
    
    .achievement-metric {
      font-size: 1.25rem;
    }
  }
</style>