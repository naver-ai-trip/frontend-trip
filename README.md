# Next.js Template Project

A modern Next.js template with TypeScript, Tailwind CSS, and Shadcn/ui components.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: Next-themes (Light/Dark mode)
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Authentication routes group
│   │   ├── login/         # Login page
│   │   └── register/      # Register page
│   ├── (dashboard)/       # Dashboard routes group
│   │   ├── profile/       # Profile page
│   │   └── settings/      # Settings page
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/                # Shadcn/ui components
│   ├── shared/            # Shared components
│   ├── custom/            # Custom components
│   ├── mode-toggle.tsx    # Theme toggle
│   └── theme-provider.tsx # Theme provider
├── features/              # Feature-based organization
│   ├── auth/              # Authentication feature
│   └── dashboard/         # Dashboard feature
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services
├── store/                 # State management
├── styles/                # Additional styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🔧 Development Rules & Guidelines

### 1. **File Naming Conventions**

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: kebab-case (e.g., `user-profile/page.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Types**: PascalCase with suffix (e.g., `UserType.ts`)

### 2. **Component Organization**

```typescript
// ✅ Good: Component structure
export interface ComponentProps {
  // Props interface first
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {};

  // Render
  return <div>{/* JSX */}</div>;
}
```

### 3. **Import Order**

```typescript
// 1. React imports
import React from "react";
import { useState, useEffect } from "react";

// 2. Third-party libraries
import { clsx } from "clsx";
import { Button } from "@radix-ui/react-button";

// 3. Internal components
import { CustomButton } from "@/components/ui/button";
import { UserCard } from "@/components/shared/user-card";

// 4. Utils and types
import { cn } from "@/lib/utils";
import type { User } from "@/types";

// 5. Relative imports
import "./component.css";
```

### 4. **Route Group Rules**

- Use parentheses for route groups: `(auth)`, `(dashboard)`
- Group related pages together
- Each group can have its own layout
- Keep authentication routes in `(auth)` group
- Keep protected routes in `(dashboard)` group

### 5. **Component Guidelines**

#### UI Components (`/components/ui/`)

- Only Shadcn/ui components
- No business logic
- Highly reusable
- Export individual components

#### Shared Components (`/components/shared/`)

- Reusable across features
- May contain some business logic
- Well-documented props

#### Custom Components (`/components/custom/`)

- Project-specific components
- Can contain complex business logic
- Less reusable than shared components

### 6. **Feature-Based Organization**

```
features/
├── auth/
│   ├── components/        # Auth-specific components
│   ├── hooks/            # Auth-specific hooks
│   └── utils/            # Auth-specific utilities
└── dashboard/
    ├── components/        # Dashboard-specific components
    ├── hooks/            # Dashboard-specific hooks
    └── utils/            # Dashboard-specific utilities
```

### 7. **TypeScript Rules**

- Always use TypeScript
- Define interfaces for all props
- Use proper types, avoid `any`
- Export types from `/types/index.ts`
- Use type imports when possible: `import type { User } from '@/types'`

### 8. **Styling Guidelines**

- Use Tailwind CSS classes
- Utilize `cn()` utility for conditional classes
- Create custom CSS only when necessary in `/styles/`
- Follow responsive design principles
- Use CSS variables for theming

### 9. **API & Services**

```typescript
// services/api.ts - Base API configuration
// services/auth-service.ts - Authentication services
// app/api/ - API routes following App Router conventions
```

### 10. **State Management**

- Use React state for component-level state
- Use context for shared state across components
- Store global state in `/store/` directory
- Consider state management libraries for complex apps

### 11. **Git & Development Workflow**

#### Commit Messages

```
feat: add user authentication
fix: resolve login form validation
docs: update README with new rules
style: format code with prettier
refactor: optimize user service
test: add login component tests
```

#### Branch Naming

- `feature/user-authentication`
- `fix/login-validation`
- `hotfix/security-patch`
- `chore/update-dependencies`

### 12. **Code Quality**

- Use ESLint configuration provided
- Format code consistently
- Write meaningful comments for complex logic
- Keep functions small and focused
- Use descriptive variable names

### 13. **Environment & Configuration**

- Keep environment variables in `.env.local`
- Never commit sensitive information
- Use Next.js built-in environment variable handling
- Configure proper TypeScript paths in `tsconfig.json`

### 14. **Testing Guidelines**

- Write unit tests for utilities
- Test components with user interactions
- Mock external dependencies
- Maintain good test coverage
- Place tests near the code they test

### 15. **Performance Best Practices**

- Use Next.js Image component for images
- Implement proper loading states
- Use dynamic imports for large components
- Optimize bundle size
- Follow Core Web Vitals guidelines

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement in appropriate feature directory
   - Add necessary types
   - Update documentation
   - Test thoroughly

2. **Component Creation**
   - Determine component category (ui/shared/custom)
   - Create with proper TypeScript interfaces
   - Follow naming conventions
   - Add to appropriate barrel exports

3. **Page Creation**
   - Use App Router conventions
   - Place in appropriate route group
   - Add proper metadata
   - Implement loading states

## 📝 Notes

- This template uses the new App Router (not Pages Router)
- All routes are organized using route groups for better structure
- Shadcn/ui components are pre-configured and ready to use
- Dark/Light theme is implemented and ready
- TypeScript paths are configured for clean imports

---

**Happy Coding! 🎉**
