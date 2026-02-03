# DOPS - Work Orchestration Platform Frontend

A modern, responsive frontend for a multi-tenant SaaS work orchestration platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Authentication**: Secure login and registration system
- **Dashboard**: Real-time team metrics and activity overview
- **Task Management**: Kanban board and list view with drag-and-drop support
- **Project Management**: Create and manage projects with team collaboration
- **Analytics**: Comprehensive insights into team performance and project health
- **Workflow Configuration**: Custom workflow states, transitions, and automation rules
- **RBAC Management**: Role-based access control with granular permissions
- **Team Management**: Invite and manage team members with different roles

### Design Highlights
- **Modern Dark UI**: Sleek dark theme with gradient accents
- **Responsive Layout**: Fully responsive across all devices
- **Interactive Components**: Smooth animations and transitions
- **Data Visualization**: Charts and graphs using Recharts
- **Accessibility**: WCAG compliant components

## 🛠️ Tech Stack

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Recharts**: Data visualization library
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client (configured for API integration)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components (Button, Input, Card, etc.)
│   └── layout/          # Layout components (Header, Sidebar)
├── pages/
│   ├── auth/            # Authentication pages (Login, Register)
│   ├── dashboard/       # Dashboard page
│   ├── tasks/           # Task management page
│   ├── projects/        # Project management page
│   ├── analytics/       # Analytics dashboard
│   ├── workflows/       # Workflow configuration
│   └── rbac/            # RBAC management
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
├── services/            # API integration services
├── utils/               # Utility functions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

The app includes a mock authentication system. To implement real authentication:

1. Update `src/stores/authStore.ts` with your API endpoints
2. Replace the mock API calls with actual backend endpoints
3. Store JWT tokens securely

### Default Demo Credentials
- Email: any@email.com
- Password: any password (8+ characters)

## 📊 Components Overview

### UI Components
- `Button`: Versatile button component with variants
- `Input`: Text input with icon support
- `Card`: Container component for content
- `Badge`: Status and category badges
- `Avatar`: User profile images
- `Modal`: Modal dialogs
- `Loader`: Loading spinner

### Layout Components
- `Header`: Top navigation with user menu
- `Sidebar`: Main navigation menu with active states

## 🎨 Customization

### Colors
Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    },
  },
}
```

### Themes
Current theme: Dark mode (Slate 950 background)

To switch to light mode, modify `src/index.css` and update Tailwind configuration.

## 🔌 API Integration

Create API client service in `src/services/api.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

export default apiClient;
```

Update store methods to use actual API calls instead of mock data.

## 📦 State Management

Using Zustand for lightweight state management:

- `authStore`: Authentication state
- `workspaceStore`: Workspace, projects, and tasks
- `uiStore`: UI state (sidebar, notifications)

## 🧪 Testing

To add testing:
```bash
npm install --save-dev vitest @testing-library/react
```

## 📝 Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=DOPS
```

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy the dist folder to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License

## 🆘 Support

For issues and feature requests, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced search and filtering
- [ ] Export reports to PDF/Excel
- [ ] Custom dashboard widgets
- [ ] Time tracking integration
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Mobile app (React Native)

---

Built with ❤️ for modern teams
