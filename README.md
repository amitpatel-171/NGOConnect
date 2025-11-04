# Hope Foundation - NGO Website

A full-featured NGO website with event management, donations, volunteer registration, user authentication, and admin panel.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access (donor, volunteer, admin)
- **Event Management**: Create, update, and delete events with registration system
- **Donation System**: Accept donations with tracking and progress visualization
- **Volunteer Registration**: Application system with admin approval workflow
- **Contact Form**: Submit inquiries and messages
- **User Dashboard**: View registered events, donation history, and volunteer status
- **Admin Panel**: Manage users, events, donations, and volunteers with analytics

## 🛠️ Tech Stack

### Frontend
- React with Vite
- TypeScript
- Tailwind CSS + Shadcn UI
- TanStack Query
- Wouter (routing)

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Drizzle ORM
- JWT Authentication
- Bcrypt for password hashing

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (provided via Replit)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (already configured on Replit):
- `DATABASE_URL`
- `SESSION_SECRET`

3. Push database schema:
```bash
npm run db:push
```

4. Seed the database with demo data:
```bash
tsx server/seed.ts
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔐 Demo Credentials

The database has been seeded with the following demo accounts:

### Admin Account
- Email: `admin@hopefoundation.org`
- Password: `password123`
- Access: Full admin panel access

### Volunteer Accounts
- Email: `sarah@example.com` / `michael@example.com`
- Password: `password123`
- Status: Approved volunteers

### Donor Accounts
- Email: `emily@example.com` / `david@example.com`
- Password: `password123`
- Has donation history

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event (requires auth)

### Donations
- `POST /api/donations` - Create donation (requires auth)
- `GET /api/donations/total` - Get total donations amount
- `GET /api/user/donations` - Get user's donations (requires auth)
- `GET /api/donations` - Get all donations (admin only)

### Volunteer Applications
- `POST /api/volunteer/apply` - Submit volunteer application (requires auth)
- `GET /api/volunteer/applications` - Get all applications (admin only)
- `PATCH /api/volunteer/applications/:id` - Update application status (admin only)
- `GET /api/user/volunteer` - Get user's volunteer application (requires auth)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/submissions` - Get all submissions (admin only)

### User Dashboard
- `GET /api/user/events` - Get user's registered events
- `GET /api/user/donations` - Get user's donation history
- `GET /api/user/volunteer` - Get user's volunteer application status

### Admin
- `GET /api/admin/stats` - Get platform statistics (admin only)

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and contexts
│   │   └── App.tsx        # Main app component
├── server/                # Backend Express application
│   ├── auth.ts           # Authentication utilities
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database operations
│   ├── db.ts             # Database connection
│   └── seed.ts           # Database seeding script
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema
└── README.md
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run check` - Run TypeScript type checking
- `tsx server/seed.ts` - Seed database with demo data

## 📝 Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
```

## 🚢 Deployment

This application is ready to deploy on Replit or any platform that supports Node.js and PostgreSQL.

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

## 📄 License

MIT

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a template for your own NGO website.
