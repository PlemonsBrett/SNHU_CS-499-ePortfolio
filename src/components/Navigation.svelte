<script>
import { onMount } from 'svelte'

let isScrolled = $state(false)
let isMobileMenuOpen = $state(false)
let isHomePage = $state(false)

onMount(() => {
  // Check if we're on the home page
  isHomePage = window.location.pathname === '/'
  
  const handleScroll = () => {
    isScrolled = window.scrollY > 20
  }
  
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
})

function toggleMobileMenu() {
  isMobileMenuOpen = !isMobileMenuOpen
}
</script>

{#if !isHomePage}
<nav class="navbar" class:scrolled={isScrolled}>
  <div class="nav-container">
    <a href="/" class="nav-logo">
      <img src="/Logo.png" alt="Logo" class="logo-img" />
      <span>Brett Plemons</span>
    </a>
    
    <div class="nav-links desktop">
      <a href="/" class="nav-link">Home</a>
      <a href="/projects" class="nav-link">Projects</a>
      <a href="/projects/code-playground" class="nav-link">Playground</a>
      <a href="#contact" class="nav-link">Contact</a>
    </div>
    
    <button class="mobile-menu-toggle" onclick={toggleMobileMenu} aria-label="Toggle menu">
      <span class="hamburger" class:open={isMobileMenuOpen}></span>
    </button>
  </div>
  
  {#if isMobileMenuOpen}
    <div class="nav-links mobile">
      <a href="/" class="nav-link" onclick={() => isMobileMenuOpen = false}>Home</a>
      <a href="/projects" class="nav-link" onclick={() => isMobileMenuOpen = false}>Projects</a>
      <a href="/projects/code-playground" class="nav-link" onclick={() => isMobileMenuOpen = false}>Playground</a>
      <a href="/#contact" class="nav-link" onclick={() => isMobileMenuOpen = false}>Contact</a>
    </div>
  {/if}
</nav>
{/if}

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  .navbar.scrolled {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    text-decoration: none;
    color: #1f2937;
    transition: color 0.2s ease;
  }
  
  .nav-logo:hover {
    color: #007acc;
  }
  
  .logo-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links.desktop {
    display: flex;
  }
  
  .nav-links.mobile {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    color: #6b7280;
    transition: color 0.2s ease;
    position: relative;
  }
  
  .nav-link:hover {
    color: #007acc;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #007acc;
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  
  .nav-link:hover::after {
    transform: scaleX(1);
  }
  
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .hamburger {
    display: block;
    width: 24px;
    height: 2px;
    background: #1f2937;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: #1f2937;
    transition: all 0.3s ease;
  }
  
  .hamburger::before {
    top: -8px;
  }
  
  .hamburger::after {
    bottom: -8px;
  }
  
  .hamburger.open {
    background: transparent;
  }
  
  .hamburger.open::before {
    top: 0;
    transform: rotate(45deg);
  }
  
  .hamburger.open::after {
    bottom: 0;
    transform: rotate(-45deg);
  }
  
  @media (max-width: 768px) {
    .nav-container {
      padding: 1rem 1.5rem;
    }
    
    .nav-links.desktop {
      display: none;
    }
    
    .nav-links.mobile {
      display: flex;
    }
    
    .mobile-menu-toggle {
      display: block;
    }
  }
</style>