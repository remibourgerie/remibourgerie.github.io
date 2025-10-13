# Rémi Bourgerie - Personal Website

A modern, interactive personal website showcasing academic research, publications, and projects in Graph Neural Networks and Machine Learning.

## 🎯 Overview

This is a responsive portfolio website built to showcase PhD research in Graph Neural Networks, featuring:

- **Interactive Research Graph** - Clickable graph visualization with dynamic content panels
- **Research Publications** - Database-driven publication management with admin panel
- **News & Updates** - Timeline of recent achievements and announcements
- **Project Portfolio** - GitHub-integrated project showcase
- **Contact Information** - Professional links and connection options

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Graph Visualization**: ReactFlow
- **Icons**: Lucide React

### Backend & Database
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (optional)

### Key Dependencies
```json
{
  "@supabase/supabase-js": "Database & Auth",
  "@tanstack/react-query": "Data fetching & caching",
  "reactflow": "Interactive graph visualization",
  "lucide-react": "Icon library",
  "tailwind-merge": "Tailwind utility merging",
  "clsx": "Conditional className utility"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account (for database features)

### Installation

1. **Clone the repository:**
```bash
git clone <YOUR_GIT_URL>
cd personal_website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run database migrations:**
```bash
# If using Supabase CLI
supabase db push

# Or manually apply migrations from /supabase/migrations/
```

5. **Start the development server:**
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## 📁 Project Structure

```
personal_website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components (button, card, etc.)
│   │   ├── Header.tsx      # Navigation header
│   │   ├── ProjectCard.tsx # GitHub project display
│   │   ├── ResearchGraph.tsx              # Interactive research graph
│   │   ├── ResearchContentPanel.tsx       # Research node content
│   │   ├── RelatedPublications.tsx        # Cross-referenced papers
│   │   ├── PublicationManager.tsx         # Publication list & filtering
│   │   ├── ResearchPaper.tsx              # Individual paper display
│   │   └── GoogleScholarIntegration.tsx   # Admin: Scholar sync
│   ├── pages/
│   │   ├── Index.tsx       # Main landing page
│   │   ├── Admin.tsx       # Publication admin panel
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/
│   │   ├── useNews.ts      # Fetch news from Supabase
│   │   ├── useGithubProjects.ts  # Fetch GitHub projects
│   │   └── useScrollAnimation.ts # Scroll reveal animations
│   ├── data/
│   │   └── researchContent.tsx   # Research nodes & graph structure
│   ├── lib/
│   │   ├── utils.ts        # Utility functions
│   │   └── githubApi.ts    # GitHub API integration
│   ├── integrations/
│   │   └── supabase/       # Supabase client & types
│   ├── assets/             # Images (profile.jpg, etc.)
│   └── App.tsx             # Root component & routing
├── public/                  # Static assets
├── supabase/
│   └── migrations/         # Database schema migrations
└── index.html              # Entry HTML
```

## 🎨 Key Features

### 1. Interactive Research Graph
**Location:** `src/components/ResearchGraph.tsx` + `src/data/researchContent.tsx`

An interactive ReactFlow-based visualization showing research areas as clickable nodes. Features:
- Sticky sidebar with graph navigation
- Dynamic content panels that update on node click
- Animated node highlighting
- Automatic layout with centered overview node

**How it works:**
- Research nodes defined in `researchContent.tsx` as data structure
- Graph component renders using ReactFlow
- Clicking nodes updates `activeNodeId` state
- `ResearchContentPanel` displays corresponding content

### 2. Research Publications System
**Components:** `PublicationManager.tsx`, `ResearchPaper.tsx`, `RelatedPublications.tsx`
**Database:** Supabase `publications` table

Publications are stored in Supabase and managed through:
- **Frontend display** with filtering by type (Conference, Journal, etc.)
- **Admin panel** (`/admin`) for CRUD operations
- **Cross-referencing** to research nodes via `research_areas` column
- **Google Scholar sync** for importing papers

Each publication supports:
- Multiple authors, abstract, year, venue
- Links: PDF, poster, code, video, slides, conference
- Tags and publication type
- Citation counts
- Illustration/thumbnail images

### 3. News & Updates Timeline
**Component:** Uses `useNews` hook
**Database:** Supabase `news` table

Displays recent updates, achievements, and announcements:
- Fetched from Supabase `news` table
- Ordered by date (most recent first)
- Supports optional links (internal or external)
- Managed via Supabase dashboard or SQL

### 4. GitHub Projects Integration
**Component:** `ProjectCard.tsx`, `useGithubProjects` hook
**API:** GitHub GraphQL API via Supabase Edge Function

Automatically displays pinned GitHub repositories with:
- Repository name, description, stars
- Primary language and tech stack
- Direct links to repo and homepage
- Real-time data from GitHub API

### 5. Admin Panel
**Route:** `/admin`
**Component:** `Admin.tsx`

Secure admin interface with:
- Supabase authentication
- Publication CRUD operations
- Google Scholar sync functionality
- Live preview of changes

## 🔧 Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔄 Modular Content System

This website is designed to be easily extensible. Here's how to add new content:

### Adding a New Research Node

**File:** `src/data/researchContent.tsx`

1. **Define the node in `researchNodes` object:**
```typescript
export const researchNodes: Record<string, ResearchNode> = {
  // ... existing nodes ...

  'new-research-area': {
    id: 'new-research-area',
    title: 'Your Research Area Title',
    tagline: 'Short catchy tagline',
    icon: YourLucideIcon,  // Import from lucide-react
    category: 'core',
    position: { x: 500, y: 200 },  // Graph coordinates
    content: {
      paragraphs: [
        <>Introductory paragraph about this research area.</>,
        <>More detailed explanation.</>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "Your personal insight or quote about this research."
          </p>
        </blockquote>
      ),
      applications: [
        'Real-world application 1',
        'Real-world application 2',
        'Real-world application 3'
      ],
      communityLinks: [
        {
          title: 'Join XYZ Community',
          description: 'Connect with researchers in this field',
          url: 'https://example.com',
          icon: Users,
        }
      ],
    },
  },
};
```

2. **Add edge to connect the node:**
```typescript
export const researchEdges: GraphEdge[] = [
  // ... existing edges ...
  { source: 'overview', target: 'new-research-area' },
];
```

3. **That's it!** The graph will automatically render the new node and clicking it will display your content.

### Adding Publications

**Option 1: Admin Panel (Recommended)**
1. Navigate to `/admin`
2. Log in with admin credentials
3. Click "Edit" on existing publication or use Google Scholar sync
4. Fill in all fields including `research_areas` to link to research nodes

**Option 2: Direct Database**
```sql
INSERT INTO publications (
  title, authors, journal, year, abstract,
  citations, research_areas, tags, publication_type
) VALUES (
  'Paper Title',
  ARRAY['Author 1', 'Author 2'],
  'Conference Name',
  2024,
  'Paper abstract...',
  0,
  ARRAY['graph-ml', 'network-science'],  -- Links to research nodes
  ARRAY['tag1', 'tag2'],
  'Conference'
);
```

**Linking to Research Nodes:**
The `research_areas` column accepts an array of research node IDs:
- `'graph-ml'` - Machine Learning on Graphs
- `'network-science'` - Network Science & Topology
- `'federated-learning'` - Federated Learning
- Any custom node ID you create

When a research node is viewed, all publications with matching `research_areas` will appear in the "Related Publications" section.

### Adding News Items

**Via Supabase Dashboard:**
```sql
INSERT INTO news (
  date, title, content, link_url, link_text,
  published, display_order
) VALUES (
  '2024-10-13',
  'Optional Title',
  'News announcement content',
  'https://example.com',
  'Learn more',
  true,
  1
);
```

**Schema:**
- `date` (DATE): Publication date (YYYY-MM-DD)
- `title` (TEXT, optional): Headline
- `content` (TEXT): Main news text
- `link_url` (TEXT, optional): External/internal link
- `link_text` (TEXT, optional): Link button text
- `link_internal` (BOOLEAN): Whether link is internal route
- `published` (BOOLEAN): Show/hide item
- `display_order` (INTEGER): Custom ordering within same date

News items appear in descending date order on the homepage.

### Adding Projects

Projects are automatically fetched from your GitHub account via the GitHub API. To feature a project:

1. **Pin the repository on GitHub** (pinned repos are automatically shown)
2. **Add a description** to your GitHub repo
3. **Set the primary language** (displayed as badge)
4. **Add homepage URL** (optional, shows as "View Demo" button)

Projects are cached and updated periodically via Supabase Edge Function.

### Customizing Research Graph Layout

**File:** `src/data/researchContent.tsx`

Adjust node positions by modifying the `position` property:
```typescript
position: { x: 400, y: 250 }  // x,y coordinates in graph space
```

The graph uses a fixed coordinate system:
- Center (overview): `{ x: 400, y: 250 }`
- Top: `{ x: 400, y: 50 }`
- Bottom-left: `{ x: 150, y: 350 }`
- Bottom-right: `{ x: 650, y: 350 }`

Adjust coordinates to create your desired layout.

## 🗄️ Database Schema

### Publications Table
```sql
- id (uuid, primary key)
- title (text)
- authors (text[])
- journal (text)
- year (integer)
- abstract (text)
- citations (integer)
- url (text) - Google Scholar link
- pdf_url, poster_url, code_url, etc. (text)
- tags (text[])
- publication_type (text) - 'Conference', 'Journal', etc.
- research_areas (text[]) - Links to research node IDs
- created_at, updated_at (timestamp)
```

### News Table
```sql
- id (uuid, primary key)
- date (date)
- title (text, optional)
- content (text)
- link_url (text, optional)
- link_text (text, optional)
- link_internal (boolean)
- published (boolean)
- display_order (integer)
- created_at (timestamp)
```

### Admin Users Table
```sql
- id (uuid, primary key)
- email (text)
- created_at (timestamp)
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (Supabase URL & Key)
4. Deploy

### Netlify
```bash
npm run build
```
Deploy the `dist` folder and configure environment variables.

### Environment Variables Required
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔐 Admin Access

To create an admin user:

1. **Sign up via Supabase Auth** (or create user in dashboard)
2. **Add to admin_users table:**
```sql
INSERT INTO admin_users (email)
VALUES ('your-email@example.com');
```
3. **Navigate to `/admin`** and log in

## 🎨 Customization

### Styling & Theme
- **Colors**: Edit Tailwind config or CSS variables in `index.css`
- **Fonts**: Modify `index.html` (Google Fonts) and Tailwind config
- **Layout**: Adjust section widths in `Index.tsx` (`max-w-4xl`, `max-w-6xl`, etc.)

### Content
- **Hero text**: `src/pages/Index.tsx` (hero section)
- **About section**: `src/pages/Index.tsx` (about section)
- **Contact info**: `src/config/contact.ts`
- **Social links**: `src/components/Header.tsx`

## 📝 Common Tasks

### Update Your Photo
Replace `src/assets/profile.jpg` with your photo (recommended: square aspect ratio, 500x500px+)

### Change Research Areas
Edit `src/data/researchContent.tsx` - add/remove/modify nodes in `researchNodes` object

### Add Publication
Use admin panel at `/admin` or insert directly into Supabase `publications` table

### Update News
Insert into `news` table via Supabase dashboard

### Modify Graph Colors/Styling
Edit styles in `src/components/ResearchGraph.tsx` (look for `<style>` tag with CSS)

## 🐛 Troubleshooting

**"Publications not loading"**
- Check Supabase connection (environment variables)
- Verify `publications` table exists and has data
- Check browser console for errors

**"Admin login fails"**
- Ensure email is in `admin_users` table
- Check Supabase Auth is enabled
- Verify environment variables are set

**"Research graph not displaying"**
- Check `researchContent.tsx` for syntax errors
- Ensure ReactFlow is installed
- Verify node positions are within viewport

**"News section empty"**
- Insert news items into `news` table
- Set `published = true`
- Check `date` format is YYYY-MM-DD

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database & Auth by [Supabase](https://supabase.com/)
- Graph visualization by [ReactFlow](https://reactflow.dev/)
