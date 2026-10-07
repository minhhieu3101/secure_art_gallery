import { useEffect, useState } from 'react';

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
    action: string;
    createdAt: string;
}

function Dashboard() {
    const { accessToken, isAuthenticated, isLoading: authLoading } = useAuth();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // AuthContext vẫn đang restore session
        if (authLoading) {
            return;
        }

        // AuthContext đã restore xong nhưng không có access token
        if (!isAuthenticated || !accessToken) {
            window.location.href = '/login';
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError('');

                console.log('Dashboard accessToken:', accessToken);

                const [roomsResponse, logsResponse] = await Promise.all([
                    axiosClient.get<Room[]>('/dashboard/room'),
                    axiosClient.get<AuditLog[]>('/dashboard/log'),
                ]);

                console.log('Rooms:', roomsResponse.data);
                console.log('Logs:', logsResponse.data);

                setRooms(roomsResponse.data);
                setLogs(logsResponse.data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error('Dashboard error:', error);
                console.error('Status:', error.response?.status);
                console.error('Response:', error.response?.data);

                setError(error.response?.data?.message || 'Unable to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [authLoading, accessToken, isAuthenticated]);

    // Authentication đang được restore
    if (authLoading) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <p>Loading authentication...</p>
            </div>
        );
    }

    // Không authenticated
    if (!isAuthenticated || !accessToken) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <p>Redirecting to login...</p>
            </div>
        );
    }

    // Dashboard đang load data
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

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <p>{error}</p>
            </div>
        );
    }

    const totalRooms = rooms.length;

    const peopleInRooms = rooms.reduce((total, room) => total + room.people, 0);

    const recentEvents = [...logs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of the gallery</p>
                </div>
            </div>

            {/* Statistics */}
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

            {/* Dashboard tables */}
            <div className="dashboard-grid">
                {/* Current Room Status */}
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
                                {rooms.map((room) => (
                                    <tr key={room.id}>
                                        <td>Room {room.number}</td>

                                        <td>{room.people}</td>

                                        <td>{room.occupancy}</td>

                                        <td>
                                            <span className={`room-status ${room.status.toLowerCase()}`}>
                                                {room.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recent Events */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Events</h2>

                        <button className="view-all-button">View All</button>
                    </div>

                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User ID</th>
                                    <th>Event</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentEvents.map((log) => (
                                    <tr key={log.auditId}>
                                        <td>
                                            {new Date(log.createdAt).toLocaleTimeString([], {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </td>

                                        <td>{log.userId}</td>

                                        <td>{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
