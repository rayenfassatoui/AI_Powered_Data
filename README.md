# AI-Powered Data Visualization Platform

A comprehensive full-stack solution for interactive data analytics with AI-powered features and advanced visualization capabilities.

## ✨ Features

- 📊 **Advanced Data Visualization**
  - Interactive charts and graphs with Recharts
  - Customizable visualization presets
  - Real-time data updates
  - Responsive design for all screen sizes

- 🤖 **AI-Powered Analytics**
  - Natural language data querying with LangChain
  - Automated insights generation
  - Pattern recognition and anomaly detection
  - Smart data preprocessing

- 📁 **Robust Data Management**
  - Excel/CSV file upload and processing
  - Intelligent column type detection
  - Advanced filtering and sorting
  - Batch operations support
  - Data validation and cleaning

- 📑 **Report Generation**
  - PDF report generation with custom templates
  - Automated data summaries
  - Export in multiple formats (CSV, Excel, PDF)
  - Scheduled report generation

- 🔐 **Enterprise-Grade Security**
  - Secure authentication with NextAuth.js
  - Role-based access control
  - Data encryption at rest
  - Audit logging
  - GDPR compliance features

- 🎨 **Modern User Interface**
  - Responsive design with Tailwind CSS
  - Dark/Light mode support
  - Intuitive navigation
  - Drag-and-drop interfaces
  - Interactive data grid

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Query, Zustand
- **Data Visualization**: Recharts, D3.js
- **UI Components**: Custom components with Radix UI

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Processing**: XLSX, Papa Parse
- **PDF Generation**: Puppeteer

### AI/ML
- **NLP**: LangChain
- **Data Analysis**: PandasAI
- **Machine Learning**: TensorFlow.js (coming soon)

### DevOps
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics
- **Testing**: Jest, React Testing Library

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-powered-data.git
   cd ai-powered-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL=""
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET=""

   # OAuth providers
   GOOGLE_ID=""
   GOOGLE_SECRET=""

   GITHUB_ID=""
   GITHUB_SECRET=""
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   ├── charts/         # Visualization components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   └── datasets/      # Dataset management
├── lib/               # Utility functions
│   ├── prisma/        # Database client
│   ├── ai/            # AI/ML utilities
│   └── charts/        # Chart configurations
├── styles/            # Global styles
└── types/             # TypeScript definitions
```

## 🔄 API Routes

### Data Management
- `POST /api/datasets` - Create new dataset
- `GET /api/datasets` - List all datasets
- `GET /api/datasets/[id]` - Get dataset details
- `PUT /api/datasets/[id]` - Update dataset
- `DELETE /api/datasets/[id]` - Delete dataset

### Analysis
- `POST /api/query` - Natural language queries
- `POST /api/analyze` - Generate insights
- `POST /api/visualize` - Create visualizations

### Reports
- `POST /api/reports/generate` - Generate reports
- `GET /api/reports/[id]` - Get report status

## 🔐 Authentication

Secure authentication powered by NextAuth.js with support for:
- Google OAuth
- GitHub OAuth
- Email/Password (with email verification)
- Magic Links (coming soon)

## 🔜 Roadmap

- [ ] Advanced AI-powered data insights
- [ ] Real-time collaboration features
- [ ] Custom visualization builder
- [ ] Data pipeline automation
- [ ] Advanced access control
- [ ] Integration with popular data sources
- [ ] Mobile app support

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All our contributors and users

---

Made with ❤️ by Rayen Fassatoui
