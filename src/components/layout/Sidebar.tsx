// components/layout/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Send,
  Users,
  Mail,
  FileText,
  Settings,
  LogOut,
  Bell,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/campaigns', icon: Send, label: 'Campaigns' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/compose', icon: Mail, label: 'Compose' },
  { to: '/templates', icon: FileText, label: 'Templates' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const systemItems = [
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: '3' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-sm">Mass Mailer</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        <div className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`
                      w-4 h-4 flex-shrink-0
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `}
                  />
                  {label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* System Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider px-3 mb-3">
            System
          </p>
          <div className="space-y-1">
            {systemItems.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `
                }
              >
                <Icon className="w-4 h-4 text-gray-400" />
                {label}
                {badge && (
                  <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              {user?.email?.[0].toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-sm font-medium truncate">
              {user?.email || 'user@example.com'}
            </p>
            <p className="text-gray-400 text-xs">Free Plan</p>
          </div>

          <button
            onClick={handleSignOut}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}