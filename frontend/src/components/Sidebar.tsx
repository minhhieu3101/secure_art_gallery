import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛</div>
        <span>ART GALLERY</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <span>▣</span>
          Dashboard
        </NavLink>

        <NavLink to="/rooms">
          <span>▤</span>
          Rooms
        </NavLink>

        <NavLink to="/people">
          <span>♙</span>
          People
        </NavLink>

        <NavLink to="/events">
          <span>◷</span>
          Events
        </NavLink>

        <NavLink to="/audit-logs">
          <span>☷</span>
          Audit Logs
        </NavLink>

        <NavLink to="/users">
          <span>♙</span>
          Users
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
