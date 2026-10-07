import { useEffect, useState } from 'react';

import axios from '../services/axiosClient';

import '../styles/People.css';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
}

function People() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await axios.get('/dashboard/user');

                console.log('Users:', response.data);

                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setError('Failed to load people.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const totalPeople = users.length;

    const activePeople = users.filter(
        (user) => user.status.toUpperCase() === 'ACTIVE',
    ).length;

    const inactivePeople = users.filter(
        (user) => user.status.toUpperCase() !== 'ACTIVE',
    ).length;

    return (
        <div className="people-page">
            {/* Header */}
            <div className="people-header">
                <div>
                    <h1>People</h1>
                    <p>Manage and monitor people in the gallery</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="people-stats">
                <div className="people-stat-card">
                    <div className="people-stat-icon blue">👥</div>

                    <div>
                        <p>Total People</p>
                        <h2>{totalPeople}</h2>
                    </div>
                </div>

                <div className="people-stat-card">
                    <div className="people-stat-icon green">✓</div>

                    <div>
                        <p>Active People</p>
                        <h2>{activePeople}</h2>
                    </div>
                </div>

                <div className="people-stat-card">
                    <div className="people-stat-icon orange">○</div>

                    <div>
                        <p>Inactive People</p>
                        <h2>{inactivePeople}</h2>
                    </div>
                </div>
            </div>

            {/* People table */}
            <section className="people-section">
                <div className="people-section-header">
                    <h2>Gallery People</h2>

                    <span>{users.length} people</span>
                </div>

                {loading && (
                    <div className="people-message">
                        Loading people...
                    </div>
                )}

                {error && (
                    <div className="people-message people-error">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="people-table-wrapper">
                        <table className="people-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="empty-people"
                                        >
                                            No people found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            {/* Username */}
                                            <td>
                                                <div className="person-name">
                                                    <span className="person-icon">
                                                        👤
                                                    </span>

                                                    <span>
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td>{user.email}</td>

                                            {/* Role */}
                                            <td>
                                                <span className="person-role">
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span
                                                    className={`person-status ${user.status.toLowerCase()}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td>
                                                <button className="view-person-button">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default People;