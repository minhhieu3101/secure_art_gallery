import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../services/axiosClient';

interface Room {
    id: string;
    number: number;
    people: number;
    occupancy: number;
    status: string;
}

interface AuditLog {
    auditId: string;
    userId: string;
    email: string;
    action: string;
    createdAt: string;
}

function getArray<T>(responseData: unknown): T[] {
    if (Array.isArray(responseData)) {
        return responseData as T[];
    }

    if (
        responseData &&
        typeof responseData === 'object' &&
        'data' in responseData &&
        Array.isArray(responseData.data)
    ) {
        return responseData.data as T[];
    }

    return [];
}

function Dashboard() {
    const navigate = useNavigate();

    const { accessToken, role, isAuthenticated, isLoading: authLoading } = useAuth();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !accessToken) {
            navigate('/login', { replace: true });
            return;
        }

        // Wait until the role has been decoded from the access token.
        if (!role) return;

        let cancelled = false;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError('');

            try {
                // All roles can view rooms.
                const roomsResponse = await axiosClient.get('/dashboard/room');

                const roomData = getArray<Room>(roomsResponse.data);

                if (cancelled) return;

                setRooms(roomData);

                // Only Admin is allowed to load audit logs.
                if (role === 'Admin') {
                    const logsResponse = await axiosClient.get('/dashboard/log');

                    if (cancelled) return;

                    setLogs(getArray<AuditLog>(logsResponse.data));
                } else {
                    setLogs([]);
                }
            } catch (err: unknown) {
                if (cancelled) return;

                console.error('Dashboard error:', err);

                if (typeof err === 'object' && err !== null && 'response' in err) {
                    const apiError = err as {
                        response?: {
                            data?: {
                                message?: string | string[];
                            };
                        };
                    };

                    const message = apiError.response?.data?.message;

                    setError(Array.isArray(message) ? message.join(', ') : message || 'Unable to load dashboard data.');
                } else {
                    setError('Unable to load dashboard data.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchDashboardData();

        return () => {
            cancelled = true;
        };
    }, [authLoading, accessToken, isAuthenticated, role, navigate]);

    // Authentication loading
    if (authLoading || !isAuthenticated || !accessToken || !role) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <p>{authLoading || (isAuthenticated && !role) ? 'Loading account...' : 'Redirecting to login...'}</p>
            </div>
        );
    }

    // Data loading
    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Data loading error
    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <p className="dashboard-error">{error}</p>

                <button type="button" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    // Shared room statistics
    const totalRooms = rooms.length;

    const openRooms = rooms.filter((room) => room.status?.toLowerCase() === 'open').length;

    const closedRooms = totalRooms - openRooms;

    const peopleInRooms = rooms.reduce((total, room) => total + (Number(room.people) || 0), 0);

    const recentEvents = [...logs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // ==================================================
    // USER DASHBOARD
    // Users can view rooms but not administrative logs.
    // ==================================================
    if (role === 'User') {
        return (
            <div className="dashboard user-dashboard">
                <div className="dashboard-header user-dashboard-heading">
                    <div>
                        <h1>Welcome to Art Gallery</h1>
                        <p>Explore the gallery rooms and check their current availability.</p>
                    </div>
                </div>

                <div className="user-room-stats">
                    <div className="user-room-stat-card">
                        <div className="user-room-stat-icon">🏛️</div>
                        <div>
                            <p>Total Rooms</p>
                            <h2>{totalRooms}</h2>
                        </div>
                    </div>

                    <div className="user-room-stat-card">
                        <div className="user-room-stat-icon open-icon">✓</div>
                        <div>
                            <p>Open Rooms</p>
                            <h2>{openRooms}</h2>
                        </div>
                    </div>

                    <div className="user-room-stat-card">
                        <div className="user-room-stat-icon closed-icon">🔒</div>
                        <div>
                            <p>Closed Rooms</p>
                            <h2>{closedRooms}</h2>
                        </div>
                    </div>
                </div>

                <section className="user-rooms-section">
                    <div className="user-rooms-section-header">
                        <div>
                            <h2>Gallery Rooms</h2>
                            <p>View room capacity, current occupancy and status.</p>
                        </div>

                        <span className="user-room-count">
                            {totalRooms} {totalRooms === 1 ? 'room' : 'rooms'}
                        </span>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="user-rooms-empty">
                            <span>🏛️</span>
                            <h3>No rooms available</h3>
                            <p>There are currently no rooms to display.</p>
                        </div>
                    ) : (
                        <div className="user-rooms-grid">
                            {rooms
                                .slice()
                                .sort((a, b) => Number(a.number) - Number(b.number))
                                .map((room) => {
                                    const isOpen = room.status?.toLowerCase() === 'open';

                                    const people = Number(room.people) || 0;
                                    const capacity = Number(room.occupancy) || 0;

                                    const occupancyPercent =
                                        capacity > 0 ? Math.min((people / capacity) * 100, 100) : 0;

                                    return (
                                        <article className="user-room-card" key={room.id}>
                                            <div className="user-room-card-top">
                                                <div className="user-room-icon">🚪</div>

                                                <span
                                                    className={`user-room-status ${
                                                        isOpen ? 'status-open' : 'status-closed'
                                                    }`}
                                                >
                                                    <span className="status-dot" />
                                                    {isOpen ? 'Open' : 'Closed'}
                                                </span>
                                            </div>

                                            <h3>Room {room.number}</h3>

                                            <p className="user-room-description">Gallery room</p>

                                            <div className="user-room-capacity">
                                                <div>
                                                    <span>People inside</span>
                                                    <strong>{people}</strong>
                                                </div>

                                                <div>
                                                    <span>Capacity</span>
                                                    <strong>{capacity}</strong>
                                                </div>
                                            </div>

                                            <div className="user-room-progress">
                                                <div className="user-room-progress-label">
                                                    <span>Occupancy</span>
                                                    <span>{Math.round(occupancyPercent)}%</span>
                                                </div>

                                                <div className="user-room-progress-track">
                                                    <div
                                                        className="user-room-progress-fill"
                                                        style={{
                                                            width: `${occupancyPercent}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="user-room-card-footer">
                                                {isOpen
                                                    ? 'This room is currently open.'
                                                    : 'This room is currently closed.'}
                                            </div>
                                        </article>
                                    );
                                })}
                        </div>
                    )}
                </section>
            </div>
        );
    }

    // ==================================================
    // EMPLOYEE DASHBOARD
    // Employees can view room information only.
    // No audit log request and no Recent Events section.
    // ==================================================
    if (role === 'Employee') {
        return (
            <div className="dashboard employee-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Rooms Overview</h1>
                        <p>View current room occupancy and status.</p>
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon orange">🚪</div>
                        <div>
                            <p>Total Rooms</p>
                            <h2>{totalRooms}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">✓</div>
                        <div>
                            <p>Open Rooms</p>
                            <h2>{openRooms}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon navy">🔒</div>
                        <div>
                            <p>Closed Rooms</p>
                            <h2>{closedRooms}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">👥</div>
                        <div>
                            <p>People in Rooms</p>
                            <h2>{peopleInRooms}</h2>
                        </div>
                    </div>
                </div>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Current Room Status</h2>
                    </div>

                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>People</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={4}>No rooms available.</td>
                                    </tr>
                                ) : (
                                    rooms
                                        .slice()
                                        .sort((a, b) => Number(a.number) - Number(b.number))
                                        .map((room) => (
                                            <tr key={room.id}>
                                                <td>Room {room.number}</td>
                                                <td>{room.people}</td>
                                                <td>{room.occupancy}</td>
                                                <td>
                                                    <span className={`room-status ${room.status?.toLowerCase() || ''}`}>
                                                        {room.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }

    // ==================================================
    // ADMIN DASHBOARD
    // Preserve the management dashboard and recent events.
    // ==================================================
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of the gallery</p>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div>
                        <p>People in Rooms</p>
                        <h2>{peopleInRooms}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">🚪</div>
                    <div>
                        <p>Total Rooms</p>
                        <h2>{totalRooms}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon navy">🏛️</div>
                    <div>
                        <p>Room Activity</p>
                        <h2>{rooms.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">📋</div>
                    <div>
                        <p>Total Logs</p>
                        <h2>{logs.length}</h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Current Room Status</h2>
                    </div>

                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>People</th>
                                    <th>Occupancy</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={4}>No rooms available.</td>
                                    </tr>
                                ) : (
                                    rooms.map((room) => (
                                        <tr key={room.id}>
                                            <td>Room {room.number}</td>
                                            <td>{room.people}</td>
                                            <td>{room.occupancy}</td>
                                            <td>
                                                <span className={`room-status ${room.status?.toLowerCase() || ''}`}>
                                                    {room.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Events</h2>

                        <button className="view-all-button" type="button" onClick={() => navigate('/audit-logs')}>
                            View All
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User Email</th>
                                    <th>Event</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={3}>No recent events.</td>
                                    </tr>
                                ) : (
                                    recentEvents.map((log) => (
                                        <tr key={log.auditId}>
                                            <td>
                                                {log.createdAt && !Number.isNaN(new Date(log.createdAt).getTime())
                                                    ? new Date(log.createdAt).toLocaleTimeString([], {
                                                          hour: 'numeric',
                                                          minute: '2-digit',
                                                      })
                                                    : '—'}
                                            </td>

                                            <td>{log.email || 'Unknown user'}</td>
                                            <td>{log.action || 'Unknown action'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
