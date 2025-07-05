# macOS-Inspired Portfolio

A modern, interactive portfolio website built with Astro, React, and TypeScript, featuring a macOS-inspired desktop interface with comprehensive testing using functional programming principles.

![Portfolio Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Testing](https://img.shields.io/badge/Testing-Functional-purple)
![Coverage](https://img.shields.io/badge/Coverage-80%25+-green)

## ✨ Features

### 🖥️ **Desktop Experience**

- **macOS Interface**: Authentic macOS-inspired desktop with draggable windows
- **Interactive Dock**: App launcher with state management and visual feedback
- **Window Management**: Multiple draggable windows with minimize/maximize/close controls
- **Background System**: Dynamic background rotation with optimized images
- **Tutorial System**: Interactive guided tour for first-time users

### 🤖 **AI Integration**

- **Terminal Interface**: AI-powered terminal with natural language interaction
- **Context-Aware Chat**: Responds intelligently about your skills and experience
- **GROQ API**: Fast LLM integration for real-time conversations

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for all device sizes
- **Touch Support**: Full touch interaction for mobile devices
- **Cross-Browser**: Tested on Chrome, Firefox, Safari, and mobile browsers

### 🧪 **Comprehensive Testing**

- **Functional Programming**: fp-ts and oxide.ts for type-safe error handling
- **Zero try/catch**: All error handling through Result/Either types
- **80% Coverage**: Unit, integration, and E2E testing
- **Cross-Browser E2E**: Playwright testing across multiple browsers

## 🛠️ Tech Stack

### **Core Framework**

- [Astro](https://astro.build/) - Static site builder with SSR capabilities
- [React](https://reactjs.org/) - Interactive UI components
- [TypeScript](https://www.typescriptlang.org/) - Strict type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling

### **Testing & Quality**

- [Vitest](https://vitest.dev/) - Unit and integration testing
- [Playwright](https://playwright.dev/) - End-to-end testing
- [fp-ts](https://gcanti.github.io/fp-ts/) - Functional programming utilities
- [oxide.ts](https://github.com/ts-belt/oxide.ts) - Result types for error handling

### **Additional Technologies**

- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editing
- [Pyodide](https://pyodide.org/) - Python runtime in browser
- [GROQ SDK](https://console.groq.com/) - AI language model integration

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your GROQ API key
   echo "GROQ_API_KEY=your_groq_api_key_here" >> .env
   ```

4. **Install Playwright browsers (for E2E testing)**

   ```bash
   pnpm run playwright:install
   ```

5. **Start development server**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:4321](http://localhost:4321) in your browser.

## 📝 Configuration

### **Personal Information**

Edit `src/config/userConfig.ts` to customize your portfolio:

```typescript
export const userConfig = {
  name: 'Your Name',
  role: 'Your Role',
  email: 'your.email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
  // ... more configuration options
};
```

### **Projects**

Add your projects in `src/config/projects/`:

1. **Manual Creation**: Create JSON files manually following the existing structure
2. **Automated Parsing**: Use the GitHub parser utility:

   ```python
   # In util/github_repo_parser.py
   def main():
       parser = GitHubRepoParser('ghp_YOUR_GITHUB_TOKEN')
       # Configure and run parser
   ```

### **Styling & Themes**

Customize colors and themes in `userConfig.ts`:

```typescript
theme: {
  primaryColor: '#1ED760',    // Spotify green
  secondaryColor: '#1d1d1f',  // Dark gray
  accentColor: '#007AFF',     // Blue accent
}
```

## 🧪 Testing

### **Philosophy**

This project uses **functional programming principles** for testing:

- **No try/catch blocks** - All error handling via Result/Either types
- **Type-safe error handling** - Comprehensive error types and validation
- **Composable test operations** - Functional composition of test steps
- **Immutable test state** - Pure functions and predictable outcomes

### **Test Commands**

```bash
# Unit & Integration Tests
pnpm run test              # Run tests in watch mode
pnpm run test:run          # Run tests once
pnpm run test:ui           # Run with UI interface
pnpm run test:coverage     # Generate coverage report

# End-to-End Tests
pnpm run test:e2e          # Run E2E tests
pnpm run test:e2e:ui       # Run E2E with UI
pnpm run test:e2e:headed   # Run E2E in headed mode

# All Tests
pnpm run test:all          # Run all tests (unit + E2E)
```

### **Functional Test Examples**

```typescript
// Safe operations with Result types
const result = pipe(
  safeRender(<Component />),
  E.fromResult,
  E.chain(() => assertElementExists('button')),
  E.chain(element => E.fromResult(safeClick(element)))
);

expect(E.isRight(result)).toBe(true);
```

### **Test Structure**

```sh
src/test/
├── unit/           # Component unit tests
├── integration/    # Component interaction tests
├── e2e/           # End-to-end user journey tests
└── utils/         # Functional testing utilities
```

## 🏗️ Development Workflow

### **Development Commands**

```bash
pnpm run dev            # Start development server
pnpm run build          # Build for production
pnpm run preview        # Preview production build
pnpm run build:wasm     # Build WebAssembly components
```

### **Code Quality**

```bash
# The project uses Biome for linting and formatting
# Configuration in package.json dependencies
```

## 📁 Project Architecture

```sh
├── src/
│   ├── components/         # React components
│   │   ├── global/        # Shared components (Dock, Terminal, etc.)
│   │   └── LandingPage.astro
│   ├── layouts/           # Layout components
│   │   ├── AppLayout.tsx  # Main desktop environment
│   │   └── Layout.astro   # Base layout
│   ├── pages/             # Astro pages and API routes
│   │   ├── api/          # Server-side API endpoints
│   │   └── index.astro   # Main page
│   ├── config/            # Configuration files
│   │   ├── projects/     # Individual project configs
│   │   └── userConfig.ts # Main user configuration
│   ├── test/              # Comprehensive test suite
│   │   ├── unit/         # Component unit tests
│   │   ├── integration/  # Integration tests
│   │   ├── e2e/          # End-to-end tests
│   │   └── utils/        # Functional test utilities
│   ├── styles/           # Global styles
│   └── assets/           # Static assets
├── public/               # Public assets
├── util/                 # Utility scripts
├── vitest.config.ts     # Vitest configuration
├── playwright.config.ts # Playwright configuration
└── CLAUDE.md           # Development guidance
```

## 🎯 Key Components

### **Desktop Environment**

- `AppLayout.tsx` - Main desktop controller with window management
- `MacToolbar.tsx` - Top menu bar with controls
- `DesktopDock.tsx` / `MobileDock.tsx` - App launchers

### **Interactive Apps**

- `MacTerminal.tsx` - AI-powered terminal interface
- `NotesApp.tsx` - Personal information and resume display
- `GitHubViewer.tsx` - Project portfolio browser
- `ResumeViewer.tsx` - PDF resume display

### **Utility Components**

- `DraggableWindow.tsx` - Window management system
- `SpotifyPlayer.tsx` - Music integration
- `HelpModal.tsx` - Tutorial and help system

## 🔧 Advanced Configuration

### **Environment Variables**

```bash
GROQ_API_KEY=your_groq_api_key     # Required for AI terminal
NODE_ENV=development               # Environment mode
```

### **Build Configuration**

- `astro.config.mjs` - Astro configuration with SSR
- `tsconfig.json` - Strict TypeScript settings
- `tailwind.config.js` - Tailwind customization
- `vitest.config.ts` - Test environment setup
- `playwright.config.ts` - E2E test configuration

### **CORS & Security**

The project includes CORS headers for WebAssembly support:

```javascript
server: {
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
  },
}
```

### **Code Standards**

- **Strict TypeScript** - No `any` types allowed
- **Functional Programming** - Use fp-ts patterns for error handling
- **No try/catch** - Use Result/Either types instead
- **Test Coverage** - Maintain 80%+ coverage
- **Type Safety** - All functions must be properly typed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by macOS interface design
- Built with modern web technologies
- Functional programming principles from the fp-ts community
- Testing patterns inspired by functional programming best practices

---

**Built with ❤️ using functional programming principles and modern web technologies.**
