/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

type EditableRole = 'User' | 'Employee';

function getErrorMessage(err: any, fallback: string): string {
    const message = err?.response?.data?.message;

    if (Array.isArray(message)) {
        return message.join(', ');
    }

    if (typeof message === 'string') {
        return message;
    }

    return fallback;
}

function People() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<EditableRole>('User');
    const [savingRole, setSavingRole] = useState(false);
    const [roleError, setRoleError] = useState('');

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Load users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get('/dashboard/user');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.data;

            if (!Array.isArray(data)) {
                setUsers([]);
                setError('Invalid user data received from server.');
                return;
            }

            setUsers(data);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError(getErrorMessage(err, 'Failed to load people.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUsers();
    }, []);

    // Statistics
    const totalPeople = users.length;

    const activePeople = users.filter(
        (user) => user.status?.toUpperCase() === 'ACTIVE',
    ).length;

    const inactivePeople = totalPeople - activePeople;

    // Open Change Role modal
    const openRoleModal = (user: User) => {
        if (user.role === 'Admin') return;

        setSelectedUser(user);
        setSelectedRole(
            user.role === 'Employee' ? 'Employee' : 'User',
        );
        setRoleError('');
        setSuccess('');
        setError('');
    };

    const closeRoleModal = () => {
        if (savingRole) return;

        setSelectedUser(null);
        setRoleError('');
    };

    // Change Role
    const handleChangeRole = async () => {
        if (!selectedUser || savingRole) return;

        try {
            setSavingRole(true);
            setRoleError('');
            setSuccess('');

            await axios.patch(
                `/admin/user/grant/${selectedUser.id}`,
                {
                    role: selectedRole,
                },
            );

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, role: selectedRole }
                        : user,
                ),
            );

            setSuccess(
                `Role for ${selectedUser.username} changed to ${selectedRole}.`,
            );

            setSelectedUser(null);
        } catch (err: any) {
            console.error('Failed to change role:', err);
            setRoleError(
                getErrorMessage(
                    err,
                    'Failed to change role. Please try again.',
                ),
            );
        } finally {
            setSavingRole(false);
        }
    };

    // Open Delete modal
    const openDeleteModal = (user: User) => {
        if (user.role === 'Admin') return;

        setDeleteUser(user);
        setDeleteError('');
        setSuccess('');
        setError('');
    };

    const closeDeleteModal = () => {
        if (deleting) return;

        setDeleteUser(null);
        setDeleteError('');
    };

    // Delete User
    const handleDeleteUser = async () => {
        if (!deleteUser || deleting) return;

        try {
            setDeleting(true);
            setDeleteError('');
            setSuccess('');

            await axios.delete(`/admin/user/${deleteUser.id}`);

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user.id !== deleteUser.id,
                ),
            );

            setSuccess(
                `User "${deleteUser.username}" was deleted successfully.`,
            );

            setDeleteUser(null);
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            setDeleteError(
                getErrorMessage(
                    err,
                    'Failed to delete user. Please try again.',
                ),
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="people-page">
            {/* Header */}
            <div className="people-header">
                <div>
                    <h1>People</h1>
                    <p>Manage and monitor people in the gallery</p>
                </div>
            </div>

            {/* Success */}
            {success && (
                <div className="people-success">{success}</div>
            )}

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
                                        <td colSpan={5} className="empty-people">
                                            No people found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="person-name">
                                                    <span className="person-icon">
                                                        👤
                                                    </span>
                                                    <span>{user.username}</span>
                                                </div>
                                            </td>

                                            <td>{user.email}</td>

                                            <td>
                                                <span className="person-role">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`person-status ${
                                                        user.status?.toLowerCase() ??
                                                        'inactive'
                                                    }`}
                                                >
                                                    {user.status ?? 'Unknown'}
                                                </span>
                                            </td>

                                            <td>
                                                {user.role === 'Admin' ? (
                                                    <span className="person-role">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <div className="people-action-buttons">
                                                        <button
                                                            type="button"
                                                            className="view-person-button"
                                                            onClick={() =>
                                                                openRoleModal(user)
                                                            }
                                                        >
                                                            Change Role
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-person-button"
                                                            onClick={() =>
                                                                openDeleteModal(user)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Change Role Modal */}
            {selectedUser && (
                <div
                    className="people-modal-overlay"
                    onClick={closeRoleModal}
                >
                    <section
                        className="people-role-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="change-role-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="people-role-modal-header">
                            <div>
                                <h2 id="change-role-title">Change Role</h2>
                                <p>
                                    Change the role for{' '}
                                    <strong>{selectedUser.username}</strong>.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="people-modal-close"
                                onClick={closeRoleModal}
                                disabled={savingRole}
                            >
                                ×
                            </button>
                        </div>

                        <div className="people-role-options">
                            <label
                                className={`people-role-option ${
                                    selectedRole === 'User' ? 'selected' : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="userRole"
                                    value="User"
                                    checked={selectedRole === 'User'}
                                    onChange={() => setSelectedRole('User')}
                                    disabled={savingRole}
                                />
                                <span>
                                    <strong>User</strong>
                                    <small>Standard gallery user</small>
                                </span>
                            </label>

                            <label
                                className={`people-role-option ${
                                    selectedRole === 'Employee'
                                        ? 'selected'
                                        : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="userRole"
                                    value="Employee"
                                    checked={selectedRole === 'Employee'}
                                    onChange={() =>
                                        setSelectedRole('Employee')
                                    }
                                    disabled={savingRole}
                                />
                                <span>
                                    <strong>Employee</strong>
                                    <small>Gallery employee role</small>
                                </span>
                            </label>
                        </div>

                        {roleError && (
                            <div className="people-role-error">
                                {roleError}
                            </div>
                        )}

                        <div className="people-role-modal-footer">
                            <button
                                type="button"
                                className="people-role-cancel"
                                onClick={closeRoleModal}
                                disabled={savingRole}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="people-role-save"
                                onClick={handleChangeRole}
                                disabled={
                                    savingRole ||
                                    selectedUser.role === selectedRole
                                }
                            >
                                {savingRole ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteUser && (
                <div
                    className="people-modal-overlay"
                    onClick={closeDeleteModal}
                >
                    <section
                        className="people-delete-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="people-delete-icon">🗑️</div>

                        <h2 id="delete-user-title">Delete User</h2>

                        <p>
                            Are you sure you want to delete{' '}
                            <strong>{deleteUser.username}</strong>?
                        </p>

                        <div className="people-delete-user-info">
                            <span>Username: {deleteUser.username}</span>
                            <span>Email: {deleteUser.email}</span>
                            <span>Role: {deleteUser.role}</span>
                        </div>

                        <p className="people-delete-warning">
                            This action cannot be undone.
                        </p>

                        {deleteError && (
                            <div className="people-role-error">
                                {deleteError}
                            </div>
                        )}

                        <div className="people-role-modal-footer">
                            <button
                                type="button"
                                className="people-role-cancel"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="people-delete-confirm"
                                onClick={handleDeleteUser}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default People;
