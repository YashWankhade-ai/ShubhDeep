import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users,
  Warehouse, 
  Tags, 
  BarChart3,
  LogOut, 
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DiyaMark } from "../Ornaments";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export const AdminLayout = ({ children, title, subtitle }) => {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8EC] text-[#42121B]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#42121B] text-[#FFF8EC] flex flex-col justify-between shrink-0 border-r border-[#C5A15B]/30">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#C5A15B]/20 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#C5A15B]/60 bg-[#641B25]">
              <DiyaMark className="h-6 w-6" light={true} />
            </span>
            <div>
              <h2 className="font-serif-display text-xl font-bold tracking-wider text-[#FFF8EC]">
                Shubh Deep
              </h2>
              <span className="text-[0.65rem] tracking-widest uppercase text-[#C5A15B]">
                Store Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold tracking-wider uppercase transition ${
                      isActive
                        ? "bg-[#641B25] text-[#C5A15B] border-l-4 border-[#C5A15B]"
                        : "text-[#FFF8EC]/70 hover:bg-[#641B25]/50 hover:text-[#FFF8EC]"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#C5A15B]/20 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded text-[#C5A15B] hover:bg-[#641B25]/50 transition"
          >
            <span className="font-medium">View Storefront</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="px-4 py-2 text-[0.7rem] text-[#FFF8EC]/50 border-t border-[#C5A15B]/10">
            Logged in as: <br />
            <span className="font-semibold text-[#FFF8EC]/90">{adminUser?.email || "Administrator"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded text-red-300 hover:bg-red-950/40 transition font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#C5A15B]/30 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-serif-display text-2xl text-[#42121B] font-bold">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#8A5A44]">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              Live Backend Active
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
