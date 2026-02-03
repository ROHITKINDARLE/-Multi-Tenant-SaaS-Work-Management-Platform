# DOPS Frontend - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd "c:\Users\parth parkhi\OneDrive\Desktop\DOPS"
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
The app will open automatically at **http://localhost:5173**

### Step 3: Login & Explore
- **Email**: demo@example.com (pre-filled)
- **Password**: demo12345 (pre-filled)
- Click **Sign In**

## 📍 What You'll See

### Dashboard
- 4 key metrics (Tasks, In Progress, Overdue, Team Members)
- Task distribution chart
- Team performance overview
- Recent activity feed

### Tasks (Kanban Board)
- 6 status columns with task cards
- Drag-and-drop ready
- Priority and assignee badges
- Toggle between Board/List view

### Projects
- Project grid with progress bars
- Status and priority indicators
- Team member count
- Project details

### Analytics
- Task throughput line chart
- Task distribution pie chart
- Team performance bar chart
- Project burndown forecast
- Time range selection (24h, 7d, 30d, 90d)

### Workflows
- Custom workflow builder
- Define states with colors
- Configure automations
- State transitions

### Team
- Team member cards
- Online/Away/Offline status
- Department and task count
- Message action ready

### RBAC
- Role management (Admin, Manager, Contributor, Viewer)
- Permission assignment
- Team member management
- Custom role creation

### Automation
- Automation rules list
- Execution log
- Rule triggers and actions
- Enable/disable toggle

### Settings
- Workspace configuration
- Notification preferences
- Security settings
- Password management

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Key Files

- **src/App.tsx**: Main routing and app structure
- **src/pages/**: All page components (10+ pages)
- **src/components/**: UI and layout components
- **src/stores/**: Zustand state management
- **src/types/**: TypeScript type definitions
- **tailwind.config.js**: Styling configuration

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` theme colors

### Change Logo/Branding
Update company name in Header component:
- `/src/components/layout/Header.tsx` (line ~26)
- `/src/pages/auth/LoginPage.tsx` (line ~37)

### Add New Page
1. Create file in `src/pages/[module]/`
2. Add route in `src/App.tsx`
3. Add navigation in `src/components/layout/Sidebar.tsx`

### Modify Styles
- Global styles: `src/index.css`
- Component styles: Use Tailwind classes in JSX
- Theme config: `tailwind.config.js`

## 🔌 Connect to Backend

### Update API Endpoint
Create `.env.local`:
```
VITE_API_URL=http://your-api.com/api
```

### Update Auth Store
Edit `src/stores/authStore.ts`:
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### Update Other Stores
Replace mock data fetch calls with actual API calls in:
- `src/stores/workspaceStore.ts`
- `src/stores/uiStore.ts`

## 📚 Project Structure

```
DOPS/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── ui/         # Base components
│   │   └── layout/     # Header, Sidebar
│   ├── pages/
│   │   ├── auth/       # Login, Register
│   │   ├── dashboard/  # Dashboard
│   │   ├── tasks/      # Task board
│   │   ├── projects/   # Projects
│   │   ├── analytics/  # Charts
│   │   ├── workflows/  # Workflow builder
│   │   ├── rbac/       # Role management
│   │   ├── team/       # Team management
│   │   ├── automation/ # Automation rules
│   │   └── settings/   # Settings
│   ├── stores/         # Zustand state
│   ├── types/          # TypeScript definitions
│   ├── services/       # API clients
│   ├── App.tsx         # Main app
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Common Tasks

### Change Default Role
Edit `src/types/index.ts`:
```typescript
export enum UserRole {
  ADMIN = 'admin',  // Change default here
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}
```

### Add Notification
In any component:
```typescript
const { addNotification } = useUIStore();
addNotification({
  type: 'success',
  message: 'Task created successfully',
});
```

### Change Theme
Modify `tailwind.config.js`:
```javascript
colors: {
  slate: {
    950: '#your-color', // Background
  },
}
```

## 🚨 Troubleshooting

### Port 5173 in Use
```bash
npm run dev -- --port 3000
```

### Build Failing
```bash
rm -rf node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
npm run lint
```

### Vite Cache Issues
```bash
rm -rf .vite
npm run dev
```

## 📱 Test on Mobile

### Local Testing
1. Start dev server: `npm run dev`
2. Find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
3. Visit: `http://your-ip:5173` on phone

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Production Build

### Build
```bash
npm run build
```

### Output
- Optimized files in `dist/` folder
- Minified CSS and JS
- Asset optimization

### Deploy
1. Copy `dist/` folder contents
2. Upload to your hosting provider
3. Set up environment variables
4. Configure SSL certificate

### Hosting Options
- Vercel (recommended for Next.js-like simplicity)
- Netlify (simple deployment)
- AWS S3 + CloudFront
- Digital Ocean
- Your own server

## 📖 Documentation

- Full docs: See `README.md`
- API patterns: See `src/stores/`
- Type definitions: See `src/types/`
- Components: See `src/components/`

## ✨ Features Overview

| Feature | Status | Location |
|---------|--------|----------|
| Authentication | ✅ | `/login`, `/register` |
| Dashboard | ✅ | `/dashboard` |
| Tasks (Board/List) | ✅ | `/tasks` |
| Projects | ✅ | `/projects` |
| Analytics | ✅ | `/analytics` |
| Workflows | ✅ | `/workflows` |
| RBAC | ✅ | `/rbac` |
| Team | ✅ | `/team` |
| Automation | ✅ | `/automation` |
| Settings | ✅ | `/settings` |

## 🎁 Included Libraries

- React 18
- TypeScript 5.3
- Tailwind CSS 3.3
- Recharts 2.10
- Lucide Icons
- Zustand
- React Router
- Axios
- Vite

## 📞 Need Help?

- Check `README.md` for detailed docs
- Review component types in `src/components/`
- Look at store examples in `src/stores/`
- Check type definitions in `src/types/`

---

**Happy coding!** Build something amazing with DOPS Frontend. 🎉
