# Desktop v1.2

Windows-style desktop environment built with React 18, TypeScript, and Next.js 14.

**Author**: @brownbeardeveloper

## Features
- Complete file system implementation
- Independent app navigation (Terminal & My Computer)
- Windows-authentic UI/UX
- Multiple applications (Terminal, File Explorer, Minesweeper, etc.)
- Responsive design

## Tech Stack
- React 18 + TypeScript
- Next.js 14 (App Router)
- Tailwind CSS
- Custom file system hook

## Quick Start
```bash
npm run dev      # Development
npm run build    # Production build
```

## Structure
- `hooks/` - Custom hooks (file system)
- `components/` - UI components and apps
- `lib/` - Utilities and icons

## Apps
All applications launch from Program Files and have independent navigation.

Portfolio content is stored in `C:\Documents\` and `C:\Users\[Browser]\`. 