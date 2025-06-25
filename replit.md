# CareerReset Application

## Overview

CareerReset is a modern web application designed to help users navigate career transitions through a structured journey. The app guides users through multiple phases including onboarding, self-discovery, role matching, application building, and progress tracking. Built with a full-stack TypeScript architecture using React frontend and Node.js/Express backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with local storage for user sessions
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized production builds
- **Design System**: Custom purple-themed design with mobile-first responsive approach

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Database Schema
The application uses a relational PostgreSQL database with the following core entities:
- **Users**: Store user credentials and contact information
- **UserProgress**: Track user journey phases and confidence metrics
- **Roles**: Job opportunities with match percentages and status
- **UserRoles**: Many-to-many relationship for user job selections
- **Applications**: Track application submissions and status
- **ConfidenceEntries**: Historical confidence tracking
- **WaitlistEntries**: Feature waitlist management

## Key Components

### Phase-Based Journey System
The application implements a 5-phase user journey:
1. **Landing/Registration**: Initial user onboarding with confidence baseline
2. **Onboarding**: Experience gathering and skill assessment
3. **Discovery**: Career narrative building and skill gap analysis
4. **Role Matching**: Job opportunity exploration and selection
5. **Application Builder**: Resume and application management
6. **Progress Dashboard**: Success tracking and journey completion

### Authentication & User Management
- Simple email-based registration without complex authentication
- User sessions managed through localStorage for user ID persistence
- Progress tracking tied to user ID for journey continuity

### Job Matching System
- Role-based matching with percentage calculations
- Status-based job availability (available, pending, locked)
- User role selection and shortlisting functionality

### Confidence Tracking
- Baseline confidence measurement during onboarding
- Progressive confidence tracking throughout the journey
- Historical confidence data visualization

## Data Flow

### User Registration Flow
1. User enters email and optional WhatsApp on landing page
2. Backend creates user record and initial progress entry
3. Frontend stores user ID in localStorage for session management
4. User redirected to onboarding phase

### Progress Management Flow
1. Each page component checks user authentication via localStorage
2. Progress updates sent to backend via API mutations
3. Phase advancement tracked in user progress table
4. TanStack Query manages cache invalidation for real-time updates

### Application Submission Flow
1. Users select roles from matching system
2. Application builder generates resume and cover letter
3. Application records created with status tracking
4. Progress dashboard displays application pipeline

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe ORM for PostgreSQL operations
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **wouter**: Lightweight React router
- **express**: Web application framework

### UI Dependencies
- **@radix-ui/***: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module for local development
- **Build Process**: Vite dev server with hot module replacement
- **Port Configuration**: Frontend on port 5000, external port 80

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `npm run db:push`
- **Deployment**: Replit autoscale deployment target

### Environment Configuration
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **NODE_ENV**: Development/production environment switching
- **Session Management**: PostgreSQL-backed sessions for production scalability

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```