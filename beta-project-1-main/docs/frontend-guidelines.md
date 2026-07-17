# 📋 Frontend Guidelines

Code style and best practices for the Weather Dashboard project.

## React & TypeScript Conventions

### 1. Component Structure

Use functional components with TypeScript:

```typescript
import React from 'react';

interface ComponentProps {
  title: string;
  onClick: () => void;
  optional?: boolean;
}

const MyComponent: React.FC<ComponentProps> = ({
  title,
  onClick,
  optional = false
}) => {
  return (
    <div className="...">
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

### 2. Naming Conventions

- **Components**: PascalCase (e.g., `WeatherCard.tsx`)
- **Functions/Variables**: camelCase (e.g., `fetchWeather()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Files**: Match component name (e.g., `WeatherCard.tsx`)

### 3. Component Organization

```typescript
// 1. Imports
import React, { useState } from 'react';
import { useNavigation } from 'react-router-dom';

// 2. Types/Interfaces
interface Props {
  data: Weather;
  onSelect?: (id: string) => void;
}

// 3. Constants
const DEFAULT_TEMP_UNIT = 'celsius';

// 4. Component
const WeatherCard: React.FC<Props> = ({ data, onSelect }) => {
  // 5. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 6. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onSelect?.(data.id);
  };

  // 7. JSX
  return (
    <div onClick={handleClick}>
      {/* Content */}
    </div>
  );
};

// 8. Export
export default WeatherCard;
```

## Tailwind CSS Guidelines

### 1. Class Organization

Follow logical order:

```jsx
<div
  className="
  // Layout
  flex flex-col gap-4
  // Sizing
  w-full max-w-md
  // Spacing
  p-4
  // Background & borders
  bg-white border border-gray-200 rounded-lg
  // Shadows & effects
  shadow-md hover:shadow-lg
  // Transitions
  transition-all duration-300
"
>
  Content
</div>
```

### 2. Custom Components with Tailwind

Create component utilities for repeated patterns:

```typescript
// components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'font-medium rounded transition-colors';

  const variants = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    />
  );
};

export default Button;
```

### 3. Responsive Design

Mobile-first approach:

```jsx
<div
  className="
  // Mobile (base)
  px-4 py-2 text-sm
  // Tablet and up
  sm:px-6 sm:py-3 sm:text-base
  // Desktop and up
  md:px-8 md:py-4 md:text-lg
  // Large screens
  lg:px-10 lg:py-6 lg:text-xl
"
>
  Content
</div>
```

### 4. Dark Mode Support

Use Tailwind's dark mode:

```jsx
<div
  className="
  bg-white dark:bg-slate-900
  text-black dark:text-white
  border border-gray-200 dark:border-gray-700
"
>
  Content
</div>
```

## TypeScript Best Practices

### 1. Type Definitions

Define types in dedicated files:

```typescript
// types/weather.ts
export interface Weather {
  id: string;
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: Date;
}

export interface Forecast {
  date: Date;
  temperature: number;
  description: string;
  precipitation: number;
}
```

### 2. Prop Types

Always define prop interfaces:

```typescript
interface WeatherDetailProps {
  weather: Weather;
  showExtended?: boolean;
  onRefresh: () => void;
}

const WeatherDetail: React.FC<WeatherDetailProps> = ({
  weather,
  showExtended = false,
  onRefresh,
}) => {
  // Component code
};
```

### 3. Avoid `any`

Always use specific types:

```typescript
// ❌ Avoid
const handleData = (data: any) => {
  console.log(data.temperature);
};

// ✅ Prefer
const handleData = (data: Weather) => {
  console.log(data.temperature);
};
```

## Custom Hooks

### 1. Hook Pattern

```typescript
// hooks/useWeather.ts
import { useState, useCallback } from "react";
import * as weatherApi from "../services/weatherApi";
import type { Weather } from "../types/weather";

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherApi.getWeather(latitude, longitude);
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { weather, loading, error, fetchWeather };
};
```

### 2. Using Custom Hooks

```typescript
const Home: React.FC = () => {
  const { weather, loading, error, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather(40.7128, -74.0060); // NYC coordinates
  }, [fetchWeather]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weather) return <div>No data</div>;

  return <WeatherCard weather={weather} />;
};
```

## State Management

### 1. Context API

Create context for global state:

```typescript
// context/WeatherContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { Weather } from '../types/weather';

interface WeatherContextType {
  weather: Weather | null;
  setWeather: (weather: Weather | null) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [weather, setWeather] = useState<Weather | null>(null);

  return (
    <WeatherContext.Provider value={{ weather, setWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider');
  }
  return context;
};
```

### 2. Using Context

```typescript
const MyComponent = () => {
  const { weather, setWeather } = useWeatherContext();

  return <div>{weather?.temperature}°C</div>;
};
```

## Performance Optimization

### 1. Memoization

Prevent unnecessary re-renders:

```typescript
// Memoize component
export const WeatherCard = memo(({
  weather,
  onSelect
}: WeatherCardProps) => {
  return <div>{/* Card content */}</div>;
});

// Memoize callback
const handleClick = useCallback(() => {
  onSelect?.(weather.id);
}, [weather.id, onSelect]);
```

### 2. Code Splitting

Lazy load routes:

```typescript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Forecast = lazy(() => import('./pages/Forecast'));

export const Routes = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Router>
      <Route path="/" element={<Home />} />
      <Route path="/forecast" element={<Forecast />} />
    </Router>
  </Suspense>
);
```

## Error Handling

### 1. Error Boundary

```typescript
// components/common/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
```

### 2. API Error Handling

```typescript
const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
```

## Code Quality

### 1. ESLint Configuration

Follows the project's ESLint config. Run:

```bash
npm run lint
```

### 2. Commit Message Format

Follow Conventional Commits:

```
feat: add weather forecast component
fix: resolve temperature unit conversion bug
docs: update API documentation
style: format component files
refactor: extract common logic into hook
test: add unit tests for WeatherCard
chore: update dependencies
```

### 3. Pull Request Guidelines

- Descriptive title and description
- Link related issues
- Include screenshots if UI changes
- Run tests locally
- Ensure ESLint passes

## Testing Best Practices

### 1. Unit Test Structure

```typescript
// components/__tests__/WeatherCard.test.tsx
import { render, screen } from '@testing-library/react';
import WeatherCard from '../WeatherCard';

describe('WeatherCard', () => {
  it('should render weather information', () => {
    const mockWeather = {
      id: '1',
      temperature: 25,
      description: 'Sunny'
    };

    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });
});
```

## Accessibility (A11y)

### 1. Semantic HTML

```jsx
// ✅ Good
<button aria-label="Close menu" onClick={handleClose}>×</button>
<img alt="Weather icon" src={iconUrl} />

// ❌ Avoid
<div onClick={handleClose}>×</div>
```

### 2. ARIA Attributes

```jsx
<div role="status" aria-live="polite" aria-atomic="true">
  Loading weather data...
</div>

<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
```

## Common Mistakes to Avoid

❌ **Don't:**

- Use `index` as key in lists
- Create components inside components
- Forget TypeScript types
- Ignore ESLint warnings
- Hardcode strings (use constants)
- Mutate state directly
- Use arrow functions in renders

✅ **Do:**

- Use meaningful keys for list items
- Define components at module level
- Always type props and state
- Fix all linting issues
- Extract magic strings to constants
- Immutably update state
- Use useCallback for memoization

---

For architecture details, see [Architecture Guide](architecture.md)
