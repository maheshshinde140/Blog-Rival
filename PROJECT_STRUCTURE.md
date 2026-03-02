# Blog Rival - Project Structure

## Quick Start

```bash
# Terminal 1: Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure

```
Blog_Rival/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── users/          # User management
│   │   ├── blogs/          # Blog CRUD
│   │   ├── likes/          # Like system
│   │   ├── comments/       # Comment system
│   │   ├── database/       # MongoDB schemas
│   │   ├── common/         # Shared utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & API
│   │   └── types/          # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── README.md               # Comprehensive documentation
└── docs/                   # Additional documentation

```

## Key Files

### Backend
- **main.ts** - Application entry point
- **app.module.ts** - Root module configuration
- **auth/** - JWT authentication implementation
- **database/schemas/** - MongoDB schemas

### Frontend
- **layout.tsx** - Root layout with navbar
- **page.tsx** - Home page
- **apiClient.ts** - Centralized API calls
- **useAuth.ts** - Auth hook for login/register

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas account

### Backend
```bash
cd backend
npm install
npm run start:dev  # Runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

## Testing the Application

1. Open http://localhost:3000
2. Click "Sign Up" or navigate to /auth/register
3. Create account with email and password
4. Login to dashboard
5. Create a new blog
6. Visit /feed to see published blogs
7. Click on a blog to view, like, and comment

## API Documentation

See README.md for complete API endpoint documentation

## Technologies

- **Backend**: NestJS, TypeScript, MongoDB, Mongoose
- **Frontend**: Next.js 15, React 19, TypeScript, Axios
- **Authentication**: JWT + Refresh Tokens
- **Database**: MongoDB with proper indexing

