# AI-Powered Data Analysis Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-pink)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A powerful, modern web application for AI-driven data analysis, visualization, and processing. Transform your raw data into actionable insights with advanced AI capabilities and beautiful visualizations.

## ✨ Features

- 📊 **Advanced Data Visualization**: Create interactive charts and graphs using Chart.js and Recharts
- 🤖 **AI-Powered Analysis**: Leverage LangChain and Together AI for intelligent data processing
- 📁 **Multiple Data Formats**: Support for CSV, Excel, and various data formats
- 📑 **PDF Generation**: Export reports and visualizations to PDF
- 🎨 **Customizable Charts**: Flexible chart customization options
- 🔒 **Secure Authentication**: Built-in authentication using NextAuth.js
- 💾 **Database Integration**: Prisma ORM for reliable data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A database supported by Prisma

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-powered-data.git
cd ai-powered-data
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your environment variables in the .env file.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 to see your application running.

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **Charts**: Chart.js, Recharts
- **AI/ML**: LangChain, Together AI
- **Data Processing**: DanfoJS, ExcelJS, PapaParser
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **PDF Generation**: PDFKit, jsPDF
- **Styling**: Tailwind CSS, clsx

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests.

## 🌟 Support

If you find this project helpful, please consider giving it a star ⭐️

---

Built with ❤️ using Next.js and TypeScript
