# AI-Powered Data Platform

A modern web application built with Next.js, TypeScript, and Prisma that provides AI-powered data analysis and visualization capabilities. The platform features Google authentication and robust data processing tools.

## 🚀 Features

- **Authentication & Authorization**
  - Google OAuth integration
  - Secure session management
  - Role-based access control

- **Data Processing**
  - Chart.js integration for data visualization
  - Excel and CSV file handling
  - PDF generation capabilities
  - Data analysis with danfojs

- **AI Integration**
  - LangChain integration
  - Together AI capabilities
  - Advanced data processing

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 13.5.4
  - React 18
  - TypeScript
  - Tailwind CSS
  - Chart.js & Recharts
  - Framer Motion

- **Backend**
  - Prisma ORM
  - NextAuth.js
  - Database session storage
  - API Routes

- **AI & Data Processing**
  - LangChain
  - Together AI
  - Excel.js & Papa Parse
  - PDF Kit

## 📋 Prerequisites

- Node.js (LTS version)
- npm or yarn
- A Google Cloud Platform account for OAuth
- A database (compatible with Prisma)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ai-powered-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in the required variables:
   ```
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL=your_database_url
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

The application is configured for deployment on Vercel with the following considerations:
- Prisma Client is automatically generated during build
- Environment variables must be configured in Vercel dashboard
- Database must be accessible from deployment environment

## 📁 Project Structure

```
src/
├── components/     # React components
├── pages/         # Next.js pages and API routes
├── lib/           # Shared utilities and configurations
├── hooks/         # Custom React hooks
├── styles/        # Global styles and Tailwind config
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and utilities
```

## 🔐 Security

- OAuth 2.0 authentication with Google
- Secure session management
- Environment variable protection
- Database connection security
- Error logging and monitoring

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the terms of the license included in the [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting capabilities
- All contributors and maintainers
