# M-TAJI Youth Changemaker Dashboard

## Overview
The Youth Changemaker Dashboard is a comprehensive platform for young environmental advocates to track their impact, manage projects, and share their stories. Built with React, TypeScript, and Tailwind CSS.

## Features Implemented

### 🔐 Authentication & Routing
- **Protected Routes**: Dashboard only accessible to authenticated users
- **Auto-redirect**: Unauthenticated users redirected to `/signin`
- **Post-login redirect**: Users automatically redirected to `/dashboard` after login/signup
- **Session persistence**: User sessions maintained via localStorage

### 🎨 Dashboard Layout
- **Header Bar**: M-TAJI logo, navigation tabs, profile thumbnail
- **Responsive Design**: Mobile-first approach with earth-tone color palette
- **Modular Components**: Clean, reusable component architecture

### 📊 Dashboard Sections

#### 1. Profile Overview (Left Panel)
- Circular profile image with user initials
- User details: Amina Kiptoo, Environmental Advocate
- Location: Nairobi, Kenya
- Mission statement
- Quick stats (Years Active, Projects Led)

#### 2. Impact Snapshot (Center Panel)
- **Stat Cards** with icons:
  - Followers: 2,430
  - Active Projects: 5
  - Funds Raised: KSh 450,000
  - Lives Impacted: 1,240
- **Recent Activity** feed with timeline

#### 3. Completed Projects (Right Panel)
- Grid of completed projects
- Each project shows:
  - Project name
  - Target vs. actual funds raised
  - Project summary
  - Completion status (✅ Completed)
  - Impact metrics

#### 4. Creative Zone (Bottom Panel)
- **Microblog Section**:
  - Text input for sharing stories
  - Media upload buttons
  - Share functionality
- **Project Gallery**:
  - Image grid with captions
  - Hover effects
  - View full gallery option

## 🎨 Design System
- **Earth-tone Palette**: Amber, orange, and brown gradients
- **Responsive Grid**: 12-column layout system
- **Card-based UI**: Clean, modern card components
- **Icon-driven Design**: SVG icons for visual appeal

## 🔧 Technical Implementation

### File Structure
```
src/
├── pages/
│   └── DashboardPage.tsx          # Main dashboard page
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx    # Header with navigation
│       ├── ProfileOverview.tsx    # User profile section
│       ├── ImpactSnapshot.tsx     # Stats and activity
│       ├── CompletedProjects.tsx  # Project showcase
│       ├── CreativeZone.tsx       # Blog and gallery
│       └── index.ts              # Component exports
└── context/
    └── AuthContext.tsx           # Authentication logic
```

### Key Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing
- **Context API**: State management

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Dashboard**:
   - Navigate to `/signup` to create an account
   - Or use `/signin` with existing credentials
   - Automatically redirected to `/dashboard`

## 🔐 Authentication Flow
1. User signs up → Auto-login → Redirect to `/dashboard`
2. User signs in → Redirect to `/dashboard`
3. Unauthenticated access to `/dashboard` → Redirect to `/signin`

## 📱 Responsive Design
- **Mobile**: Single-column layout with collapsible navigation
- **Tablet**: Two-column layout for better space utilization
- **Desktop**: Full three-column layout with all features

## 🎯 Future Enhancements
- Real-time notifications
- Project management tools
- Fundraising integration
- Social media sharing
- Analytics dashboard
- Team collaboration features

## 🛠 Development Notes
- Uses placeholder data for demonstration
- All images are from Unsplash (placeholder URLs)
- Authentication uses localStorage for session management
- Components are fully modular and reusable 