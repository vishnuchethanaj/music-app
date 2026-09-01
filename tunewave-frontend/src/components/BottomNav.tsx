import { NavLink } from 'react-router-dom';
import { Home, Compass, UploadCloud, Library, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/home', icon: <Home size={24} />, label: 'Home' },
    { to: '/discover', icon: <Compass size={24} />, label: 'Discover' },
    { to: '/upload', icon: <UploadCloud size={24} />, label: 'Upload' },
    { to: '/library', icon: <Library size={24} />, label: 'Library' },
    { to: '/profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-surface border-t border-slate-700 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
