import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Mail,
  Home,
  LogOut,
  Menu,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/format";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Collections",
    path: "/admin/collections",
    icon: Layers,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Contact",
    path: "/admin/contact",
    icon: Mail,
  },
  {
    label: "Policies",
    path: "/admin/policies",
    icon: FileText,
  },
];

export function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { signOut, profile } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#1a1a1a] text-white transition-transform lg:sticky",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="border-b border-white/10 px-6 py-5">
          <Link
            to="/admin"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="font-serif text-lg tracking-[0.1em] text-white"
          >
            HOUSE OF YAHARA
          </Link>

          <p className="mt-1 text-xs text-white/40">
            Admin Dashboard
          </p>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  active
                    ? "border-l-2 border-white bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ===================================================
            SIDEBAR FOOTER
        =================================================== */}

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link
            to="/"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex items-center gap-3 px-2 py-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Home
              size={18}
              strokeWidth={1.5}
            />

            <span>View Site</span>
          </Link>

          <button
            type="button"
            onClick={async () => {
              setSidebarOpen(false);
              await signOut();
            }}
            className="flex w-full items-center gap-3 px-2 py-2 text-left text-sm text-white/60 transition-colors hover:text-white"
          >
            <LogOut
              size={18}
              strokeWidth={1.5}
            />

            <span>Sign Out</span>
          </button>

          {profile && (
            <p className="truncate px-2 pt-2 text-xs text-white/40">
              {profile.email}
            </p>
          )}
        </div>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="min-w-0 flex-1">
        {/* ===================================================
            MOBILE HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#1a1a1a] px-4 py-4 text-white lg:hidden">
          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open admin menu"
            className="text-white"
          >
            <Menu
              size={22}
              strokeWidth={1.5}
            />
          </button>

          <span className="font-serif text-sm tracking-[0.1em]">
            ADMIN
          </span>

          <Link
            to="/"
            className="text-white/60 transition-colors hover:text-white"
            aria-label="View website"
          >
            <Home
              size={20}
              strokeWidth={1.5}
            />
          </Link>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="mx-auto max-w-6xl p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

/*
 * Export as default as well.
 *
 * This makes the component compatible with either:
 *
 * import { AdminLayout } from "@/components/admin/AdminLayout";
 *
 * or:
 *
 * import AdminLayout from "@/components/admin/AdminLayout";
 */
export default AdminLayout;