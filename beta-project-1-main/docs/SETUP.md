# 🚀 Setup Guide

Complete setup instructions for getting the Weather Dashboard up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** 2.30.0 or higher

### Verify Installation

```bash
node --version   # v18.0.0 or higher
npm --version    # 9.0.0 or higher
git --version    # 2.30.0 or higher
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/cloud-beta-hub/beta-project-1.git
cd beta-project-1
cd weather-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

**Installed Packages:**

- React & React DOM - UI framework
- React Router - Routing
- TypeScript - Type safety
- Tailwind CSS - Styling
- Vite - Build tool
- ESLint - Linting

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following variables (replace with your actual API keys):

```env
# Weather API
VITE_WEATHER_API_KEY=your_weather_api_key_here
VITE_WEATHER_API_URL=https://api.openweathermap.org/data

# Optional: Location API
VITE_LOCATION_API_KEY=your_location_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

**Output should show:**

```
VITE v8.1.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 5. Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the Weather Dashboard home page
3. Check browser console (F12) for any errors

## Development Setup

### IDE Setup

#### Visual Studio Code (Recommended)

1. Install extensions:
   - **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
   - **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
   - **TypeScript Vue Plugin** - Vue.vscode-typescript-vue-plugin
   - **ESLint** - dbaeumer.vscode-eslint
   - **Prettier** - esbenp.prettier-vscode

2. Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Linting & Format

Check code quality:

```bash
npm run lint
```

This runs ESLint on all files to ensure code standards.

## Building for Production

### Create Production Build

```bash
npm run build
```

This command:

1. Compiles TypeScript (`tsc -b`)
2. Creates optimized production bundle
3. Outputs to `dist/` folder

### Preview Production Build Locally

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 5173 already in use

**Solution:**

```bash
# Vite will automatically use the next available port
# Or specify a custom port:
npm run dev -- --port 3000
```

### Issue: TypeScript errors in IDE

**Solution:**

```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > TypeScript: Restart TS Server
```

### Issue: Tailwind styles not appearing

**Solution:**

1. Ensure `tailwind.config.js` includes all template paths
2. Rebuild: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)

## NPM Scripts Reference

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Project Dependencies

### Main Dependencies

- `react@^19.2.7` - UI library
- `react-dom@^19.2.7` - React DOM rendering
- `react-router-dom@^7.18.1` - Client-side routing

### Dev Dependencies

- `typescript` - TypeScript language
- `tailwindcss@^4.3.2` - Utility-first CSS
- `vite@^8.1.1` - Build tool
- `eslint` - Code linting
- `@vitejs/plugin-react` - React plugin for Vite

## Next Steps

1. Read the [Architecture Guide](architecture.md)
2. Review [Frontend Guidelines](frontend-guidelines.md)
3. Check [API Contract](api-contract.md)
4. Explore [UI Design System](ui-design.md)

## Getting Help

- Check existing [GitHub Issues](https://github.com/cloud-beta-hub/beta-project-1/issues)
- Ask in the team chat
- Review documentation
- Run `npm run lint` to catch issues

---

**You're all set! Happy coding! 🎉**
