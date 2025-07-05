# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm run dev` - Start development server (runs at <http://localhost:4321>)
- `pnpm run build` - Build the project for production
- `pnpm run preview` - Preview the production build locally
- `pnpm run build:wasm` - Build WebAssembly components

### Testing Commands

- `pnpm run test` - Run unit/integration tests with Vitest
- `pnpm run test:ui` - Run tests with Vitest UI interface
- `pnpm run test:run` - Run tests once (no watch mode)
- `pnpm run test:coverage` - Run tests with coverage reporting
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:e2e` - Run E2E tests with Playwright
- `pnpm run test:e2e:ui` - Run E2E tests with Playwright UI
- `pnpm run test:e2e:headed` - Run E2E tests in headed mode
- `pnpm run test:all` - Run all tests (unit + E2E)
- `pnpm run playwright:install` - Install Playwright browsers

## Architecture Overview

This is a **macOS-inspired portfolio website** built with Astro, React, and TypeScript. The application creates an interactive desktop environment with draggable windows and a dock-based navigation system.

### Key Architectural Components

**Main Application Structure:**

- **Astro SSR**: Server-side rendering enabled for API routes (required for GROQ AI integration)
- **React Integration**: Interactive components using React with client-side hydration
- **Desktop Metaphor**: macOS-like interface with windows, dock, and desktop background

**Core Layout System:**

- `src/layouts/AppLayout.tsx` - Main desktop environment controller
- `src/components/LandingPage.astro` - Entry point that initializes the desktop
- Dynamic background system with optimized image loading

**Interactive Components:**

- `MacTerminal.tsx` - AI-powered terminal chat interface using GROQ API
- `NotesApp.tsx` - Personal information display (education, experience, skills)
- `GitHubViewer.tsx` - Project portfolio browser with repository integration
- `ResumeViewer.tsx` - PDF resume display
- `DraggableWindow.tsx` - Window management system

### Configuration System

**User Configuration:**

- `src/config/userConfig.ts` - Central configuration file for personal data
- `src/config/projects/*.json` - Individual project configurations
- Dynamic project loading system

**Project Structure:**

- Each project has dedicated JSON config with metadata, screenshots, and GitHub links
- Projects are imported and displayed through the GitHub viewer component

### AI Integration

**GROQ API Integration:**

- `src/pages/api/chat.ts` - API route for AI chat functionality
- Requires `GROQ_API_KEY` environment variable
- Used by the terminal component for interactive conversations

### Development Setup

**Environment Variables:**

- `GROQ_API_KEY` - Required for AI terminal functionality
- Set up in `.env` file in project root

**Asset Management:**

- Static assets in `public/` directory
- Optimized images using Astro's image optimization
- WASM files for Python integration (Pyodide)

**Special Dependencies:**

- `pyodide` - Python runtime in browser
- `monaco-editor` - Code editor integration
- `framer-motion` - Animation library
- `@codesandbox/sandpack-react` - Code sandboxing

### Key Features

**Interactive Desktop:**

- Multiple draggable windows with macOS-style controls
- Dock navigation with app state management
- Background rotation system
- Tutorial system for first-time users

**Project Portfolio:**

- GitHub repository integration
- Project filtering and search
- Code preview and structure visualization
- Screenshot galleries for each project

**AI Terminal:**

- Natural language interaction about skills and experience
- Context-aware responses based on user configuration
- Terminal-style interface with command history

### Deployment Configuration

**Vercel Deployment:**

- Server-side rendering enabled
- Vercel adapter configured
- Automatic sitemap generation
- SEO optimization with structured data

**Build Configuration:**

- TypeScript strict mode
- Tailwind CSS v4 with Vite plugin
- WASM and top-level await support
- CORS headers for cross-origin isolation

### Data Management

**User Data Customization:**

- All personal information centralized in `userConfig.ts`
- Project data separated into individual JSON files
- Image URLs and assets configurable per section
- Social links and contact information

**Project Data Structure:**

- Each project includes: description, tech stack, screenshots, GitHub links
- Automatic parsing available via `util/github_repo_parser.py`
- Support for multiple image galleries per project

## Testing Architecture

**Testing Philosophy:**

- **Strict TypeScript**: All tests use strict TypeScript with no `any` types
- **Functional Programming**: Uses fp-ts and oxide.ts for error handling
- **No try/catch**: All error handling done through Result/Either types
- **Comprehensive Coverage**: Unit, integration, and E2E testing

**Testing Stack:**

- **Vitest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: Cross-browser E2E testing
- **fp-ts**: Functional programming utilities for test composition
- **oxide.ts**: Result type for safe error handling

**Test Structure:**

- `src/test/unit/` - Component unit tests
- `src/test/integration/` - Component interaction tests
- `src/test/e2e/` - End-to-end user journey tests
- `src/test/utils/` - Functional testing utilities

**Functional Test Utilities:**

- `safeRender()` - Safe component rendering with Result type
- `safeClick()`, `safeType()` - Safe user interactions
- `assertElementExists()` - Functional assertions
- `composeTestSteps()` - Test step composition
- Error types: `RenderError`, `InteractionError`, `AssertionError`, `TimeoutError`

**Coverage Requirements:**

- Minimum 80% coverage for branches, functions, lines, and statements
- Type checking enabled in test environment
- HTML and JSON coverage reports generated
