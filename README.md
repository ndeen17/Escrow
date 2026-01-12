# Escon - Secure Escrow Service

A modern, responsive escrow service platform built with React and Tailwind CSS.

## Features

- **Role-Based Signup Flow**: Choose from Client, Agency, or Freelancer roles
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean interface with lime green (#ADF033) brand color
- **Interactive Components**: Dynamic role cards with radio button selection
- **Form Validation**: Built-in validation for registration forms

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
Escrow/
├── src/
│   ├── components/
│   │   ├── SignIn.jsx              # Sign-in page
│   │   ├── RoleSelection.jsx       # Role selection screen
│   │   ├── RoleCard.jsx            # Reusable role card component
│   │   ├── Icons.jsx               # SVG icons and radio button
│   │   ├── ClientRegistration.jsx  # Client registration form
│   │   ├── AgencyRegistration.jsx  # Agency registration form
│   │   └── FreelancerRegistration.jsx # Freelancer registration form
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## User Flows

### 1. Sign In
- Landing page with email/password login
- "Create an account" button navigates to role selection

### 2. Role Selection
- Choose from three roles:
  - **Client**: Manage contracts with service providers
  - **Agency**: Team-based client work
  - **Freelancer**: Individual client work
- Continue button remains disabled until a role is selected
- Each role has a unique icon and description

### 3. Registration
- Role-specific registration forms
- Form fields tailored to each user type
- Password confirmation
- Terms of Service agreement

## Customization

### Colors

The primary brand color is defined in [tailwind.config.js](tailwind.config.js):

```js
colors: {
  'escon-green': '#ADF033',
  'escon-green-hover': '#9DE020',
}
```

### Icons

Custom SVG icons are defined in [src/components/Icons.jsx](src/components/Icons.jsx). You can replace these with your own designs or use an icon library.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Best Practices Implemented

✅ **Mobile-First Design**: Responsive layouts that adapt to all screen sizes  
✅ **Accessible Forms**: Proper labels and required field indicators  
✅ **State Management**: React hooks for managing component state  
✅ **Reusable Components**: DRY principle with RoleCard component  
✅ **Professional Icons**: Clean SVG icons for trust and credibility  
✅ **Smooth Transitions**: CSS transitions for better UX  
✅ **Disabled States**: Visual feedback for form validation  

## Future Enhancements

- Backend API integration
- Authentication with JWT
- Email verification
- Password strength meter
- Social media login options
- Dashboard for each user role
- Contract management system
- Payment integration

## License

Private project - All rights reserved

## Support

For questions or support, contact the Escon team.
