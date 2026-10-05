import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-title">Art Gallery Management System</div>

      <div className="header-user">
        <span className="user-icon">👤</span>

        <span className="user-name">Admin</span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
