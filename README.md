# Blog Rival

Blog Rival is a full-stack blogging platform with authentication, profile management, public feed, likes, comments, password reset, and image uploads stored in MongoDB.

## Features

- User registration and login (JWT auth)
- Forgot/reset password flow
- Public feed with pagination
- Blog CRUD from user dashboard
- Like and comment system
- Profile page with editable user details
- Profile image upload (stored in database)
- Blog featured image upload (stored in database)
- Responsive UI with route loading indicator, favicon, and SEO metadata

## Tech Stack

### Backend
- NestJS
- TypeScript
- MongoDB + Mongoose
- class-validator
- JWT

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Axios

## Project Structure

```text
Blog_Rival/
  backend/
  frontend/
  README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Run backend

```bash
cd backend
npm run start
```

Backend: `http://localhost:3001`

### 3. Run frontend

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:3000`

## API Highlights

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

### Users
- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/profile-image`

### Blogs
- `POST /blogs`
- `GET /blogs`
- `GET /blogs/:id`
- `PATCH /blogs/:id`
- `DELETE /blogs/:id`
- `POST /blogs/:id/featured-image`
- `GET /blogs/public/feed`
- `GET /blogs/public/:slug`

### Likes
- `POST /blogs/:blogId/likes`
- `DELETE /blogs/:blogId/likes`

### Comments
- `GET /blogs/:blogId/comments`
- `POST /blogs/:blogId/comments`
- `DELETE /blogs/:blogId/comments/:commentId`

## Build and Lint

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Notes

- Uploaded images are stored in MongoDB as data URI strings.
- `.env` files are ignored by git via `.gitignore`.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
