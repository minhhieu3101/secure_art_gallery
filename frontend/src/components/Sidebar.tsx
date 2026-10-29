import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "▣",
    roles: ["Admin", "User"],
  },
  {
    label: "Rooms",
    path: "/rooms",
    icon: "▤",
    roles: ["Admin", "Employee"],
  },
  {
    label: "People",
    path: "/people",
    icon: "♙",
    roles: ["Admin", "Employee"],
  },
  {
    label: "Events",
    path: "/events",
    icon: "◷",
    roles: ["Admin", "Employee"],
  },
  {
    label: "Audit Logs",
    path: "/audit-logs",
    icon: "☷",
    roles: ["Admin"],
  },
  {
    label: "My Account",
    path: "/my-account",
    icon: "♙",
    roles: ["Admin", "Employee", "User"],
  },
];

function Sidebar() {
  const { role, isLoading } = useAuth();

  const visibleItems = menuItems.filter(
    (item) => role !== null && item.roles.includes(role),
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛</div>
        <span>ART GALLERY</span>
      </div>

      <nav className="sidebar-nav">
        {isLoading
          ? null
          : visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
      </nav>
    </aside>
  );
}

export default Sidebar;