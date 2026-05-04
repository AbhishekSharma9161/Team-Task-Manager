import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Zap,
  ChevronRight,
  Bell,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 flex-shrink-0 bg-ink-900 border-r border-white/5 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink-950" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Team Task Manager
            </span>
          </div>
          <p className="text-xs text-white/30 font-mono mt-1 ml-10">
            team workspace
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="label px-3 mb-3">Menu</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200 group ${
                  isActive
                    ? "bg-acid/10 text-acid border border-acid/20"
                    : "text-white/50 hover:text-white hover:bg-ink-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ink-800 border border-white/5">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=BFFF00&color=0A0A0F`
              }
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-white/30 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-ink-700 rounded-lg transition-colors text-white/30 hover:text-coral"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
