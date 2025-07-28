# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Pages portfolio site for the CS 499 Computer Science Capstone at SNHU. The portfolio showcases work in:
- Software Engineering & Design
- Algorithms & Data Structures
- Databases

The site is configured to use the Jekyll Cayman theme and is deployed to portfolio.plemons.dev.

## Development Commands

### Local Development

To run the site locally with Jekyll:
```bash
bundle install
bundle exec jekyll serve
```

The site will be available at http://localhost:4000

### GitHub Pages Deployment

The site is automatically deployed via GitHub Pages when changes are pushed to the main branch. No manual build step is required.

## Project Structure

This is a minimal Jekyll site with:
- `_config.yaml` - Jekyll configuration specifying the remote theme and site metadata
- `CNAME` - Custom domain configuration for GitHub Pages
- `README.md` - Portfolio content (currently under construction)
- `LICENSE` - Project license

## Adding Portfolio Content

Portfolio projects and content should be added as:
- Markdown files in the root directory (they will be automatically processed by Jekyll)
- For multi-page content, create directories with index.md files
- Images and assets can be placed in an `assets/` directory

## Configuration Notes

- The site uses the `pages-themes/cayman@v0.2.0` remote theme
- Custom domain is configured to portfolio.plemons.dev
- Jekyll plugins are managed through the jekyll-remote-theme plugin