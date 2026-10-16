import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

function Header() {
    const { logout, role, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="header">
            <div className="header-title">Art Gallery Management System</div>

            <div className="header-user">
                <span className="user-icon">👤</span>

                <span className="user-name">
                    {role ?? 'User'}
                    {username ? ` - ${username}` : ''}
                </span>

                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
}

export default Header;
