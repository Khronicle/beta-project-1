# 🌤️ Weather Dashboard

A modern, responsive weather forecasting application built with React, TypeScript, and Tailwind CSS. Get real-time weather data, detailed forecasts, and location-based insights with a beautiful and intuitive user interface.

## ✨ Features

- **Real-time Weather Data** - Current weather conditions and temperature
- **7-Day Forecast** - Detailed weather predictions for the week
- **Location Search** - Find weather for any location worldwide
- **Geolocation Support** - Auto-detect user's current location
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Theme UI** - Eye-friendly interface with Tailwind CSS
- **Type-Safe** - Built with TypeScript for reliability

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.7
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.3.2
- **Routing**: React Router v7.18.1
- **Build Tool**: Vite 8.1.1
- **Linting**: ESLint 10.6.0

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd weather-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Builds the TypeScript and creates an optimized production bundle in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality.

## 📁 Project Structure

```
src/
├── app/                 # App-level files and configuration
├── components/          # Reusable React components
│   ├── common/         # Common reusable components
│   ├── weather/        # Weather-specific components
│   ├── alerts/         # Alert notification components
│   └── layout/         # Layout components (Navbar, Footer)
├── pages/              # Page components
│   ├── Home/          # Home page
│   ├── Forecast/      # 7-day forecast page
│   ├── About/         # About page
│   └── NotFound/      # 404 page
├── hooks/             # Custom React hooks
├── services/          # API services
│   ├── weatherApi.js  # Weather API integration
│   └── locationApi.js # Location/Geolocation API
├── context/           # React Context for state management
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── styles/            # Global styles
├── App.tsx            # Root component
├── main.tsx           # App entry point
└── index.css          # Global CSS
```

## 📚 Documentation

Comprehensive documentation for developers:

- **[Setup Guide](docs/SETUP.md)** - Detailed setup instructions and environment configuration
- **[Architecture](docs/architecture.md)** - System design and component architecture
- **[Frontend Guidelines](docs/frontend-guidelines.md)** - React, TypeScript, and Tailwind CSS conventions
- **[API Contract](docs/api-contract.md)** - Weather API integration and endpoints
- **[UI Design System](docs/ui-design.md)** - Design tokens, colors, and component specifications

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for our code of conduct and development process.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and test thoroughly
3. Run linting: `npm run lint`
4. Commit with clear messages: `git commit -m "feat: add feature description"`
5. Push to your branch: `git push origin feature/feature-name`
6. Create a Pull Request with detailed description

## 📝 Git Conventions

- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `docs:` - Documentation
  - `style:` - Code style changes
  - `refactor:` - Code refactoring
  - `test:` - Testing
  - `chore:` - Maintenance

## 🎯 Next Steps

1. **Set up API integrations** - Configure weather API keys
2. **Implement location services** - Set up geolocation and reverse geocoding
3. **Add state management** - Set up React Context or Redux if needed
4. **Write tests** - Add unit and integration tests
5. **Deploy** - Prepare for production deployment

## 📞 Support & Contact

For questions or issues, please create an Issue on GitHub or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🎉**
