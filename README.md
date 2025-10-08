# Rémi Bourgerie - Personal Website

A modern, interactive personal website showcasing academic research, publications, and projects in Graph Neural Networks and Machine Learning.

## 🎯 Overview

This is a responsive portfolio website built to showcase PhD research in Graph Neural Networks, featuring:

- **Interactive graph visualizations** - Animated background showcasing graph theory concepts
- **Research publications** - Curated list of academic papers and publications
- **Project portfolio** - Open-source projects and research tools
- **Blog posts** - Technical articles on topics like sheaves on graphs
- **LinkedIn integration** - Recent professional updates and insights
- **Newsletter subscription** - Stay connected with research updates

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (for newsletter subscriptions)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd personal_website
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

The site will be available at `http://localhost:5173`

## 📁 Project Structure

```
personal_website/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components (Index, Blog posts, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── integrations/     # External service integrations (Supabase)
│   ├── assets/           # Images and static assets
│   └── App.tsx           # Main application component
├── public/               # Public static files
├── supabase/            # Supabase configuration and migrations
└── index.html           # Entry HTML file
```

## 🎨 Key Features

### Interactive Graph Visualization
Custom-built animated graph network in the hero section using Canvas API, demonstrating graph theory concepts relevant to the research.

### Research Publications Manager
Dynamic component for managing and displaying academic publications with filtering and search capabilities.

### Blog System
Dedicated pages for in-depth technical blog posts (e.g., `/blog/sheaves-on-graphs`).

### Responsive Design
Fully responsive layout optimized for desktop, tablet, and mobile devices.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🌐 Deployment

The project can be deployed to various platforms:

### Vercel / Netlify
```bash
npm run build
```
Then deploy the `dist` folder.

### Lovable Platform
Simply open the project in [Lovable](https://lovable.dev) and click Share → Publish.

## 📝 Content Customization

### Adding Publications
Edit the publications data in [src/pages/Index.tsx](src/pages/Index.tsx) or integrate with a CMS.

### Adding Blog Posts
1. Create a new page component in `src/pages/`
2. Add the route in [src/App.tsx](src/App.tsx)
3. Update navigation in [src/components/Header.tsx](src/components/Header.tsx)

### Updating Projects
Modify the projects array in [src/pages/Index.tsx](src/pages/Index.tsx).

## 🔗 Connect

- **Website**: [Your deployed URL]
- **LinkedIn**: [LinkedIn Profile]
- **GitHub**: [GitHub Profile]
- **Email**: [Contact Email]

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
