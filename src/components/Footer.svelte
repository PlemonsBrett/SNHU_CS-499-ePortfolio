<script>
  import { siteConfig, getSocialLinks } from '../config/site.js';
  
  const currentYear = new Date().getFullYear();
  const socialLinks = getSocialLinks();
</script>

<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">{siteConfig.owner.name}</h3>
        <p class="footer-description">
          {siteConfig.owner.tagline}
        </p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Connect</h4>
        <div class="social-links">
          {#each socialLinks as link}
            <a 
              href={link.url}
              class="social-link"
              aria-label={link.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {@html link.icon}
            </a>
          {/each}
        </div>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Quick Links</h4>
        <nav class="footer-nav">
          {#each siteConfig.navigation.footer as link}
            <a href={link.href} class="footer-link">{link.label}</a>
          {/each}
        </nav>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="copyright">
        © {currentYear} {siteConfig.owner.name}. All rights reserved.
      </p>
      <p class="footer-note">
        {siteConfig.branding.techStack}
      </p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: auto;
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    color: #e0e0e0;
    padding: 3rem 0 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .footer-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .footer-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  .footer-subtitle {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0;
  }

  .footer-description {
    color: #9ca3af;
    line-height: 1.6;
    margin: 0;
  }

  .social-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: #e0e0e0;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .social-link:hover {
    background: rgba(103, 126, 234, 0.2);
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
  }

  .footer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.95rem;
  }

  .footer-link:hover {
    color: #667eea;
  }

  .footer-bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .copyright {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }

  .footer-note {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }

    .social-links {
      justify-content: center;
    }

    .footer-nav {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
</style>