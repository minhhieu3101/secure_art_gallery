/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import '../styles/PeopleInRoom.css';

interface Person {
    id: string;
    username: string;
    email: string;
}

interface LocationState {
    roomNumber?: number;
}

function normalizePeople(responseData: unknown): Person[] {
    let data: unknown = responseData;

    // Support API responses wrapped in { data: [...] }.
    if (data && typeof data === 'object' && 'data' in data) {
        data = (data as { data: unknown }).data;
    }

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map((item: Record<string, unknown>) => ({
        id: String(item.id ?? item.email ?? ''),
        username: String(item.username ?? ''),
        email: String(item.email ?? ''),
    }));
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join(', ');
        }

        if (typeof message === 'string') {
            return message;
        }

        if (error.response?.status === 401) {
            return 'Please log in again.';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to view this room.';
        }
    }

    return 'Failed to load people in this room. Please try again.';
}

function PeopleInRoom() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LocationState | null;
    const roomNumber = state?.roomNumber;

    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPeople = useCallback(async () => {
        if (!id) {
            setError('Room ID is missing.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axiosClient.get(`/events/room/people/${id}`);

            setPeople(normalizePeople(response.data));
        } catch (err: unknown) {
            console.error('Failed to load people in room:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchPeople();
    }, [fetchPeople]);

    return (
        <div className="people-room-page">
            <header className="people-room-header">
                <div>
                    <h1>{roomNumber !== undefined ? `People in Room ${roomNumber}` : 'People in Room'}</h1>

                    <p>View the people currently inside this room.</p>
                </div>

                <button type="button" className="people-room-back-button" onClick={() => navigate('/rooms')}>
                    ← Back to Rooms
                </button>
            </header>

            <section className="people-room-card">
                <div className="people-room-card-header">
                    <div>
                        <h2>Current Occupants</h2>
                        <p>
                            {loading
                                ? 'Loading occupants...'
                                : `${people.length} ${people.length === 1 ? 'person' : 'people'}`}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="people-room-refresh-button"
                        onClick={() => void fetchPeople()}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div className="people-room-error" role="alert">
                        <span>{error}</span>

                        <button type="button" onClick={() => void fetchPeople()}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="people-room-empty">Loading people...</div>
                ) : error ? null : people.length === 0 ? (
                    <div className="people-room-empty">
                        <span className="people-room-empty-icon">👥</span>
                        <h3>No people in this room</h3>
                        <p>There are currently no occupants recorded in this room.</p>
                    </div>
                ) : (
                    <div className="people-room-table-wrapper">
                        <table className="people-room-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                </tr>
                            </thead>

                            <tbody>
                                {people.map((person) => (
                                    <tr key={person.id}>
                                        <td>
                                            <div className="people-room-username">
                                                <span className="people-room-avatar">
                                                    {person.username.charAt(0).toUpperCase() || 'U'}
                                                </span>

                                                <span>{person.username || '—'}</span>
                                            </div>
                                        </td>

                                        <td>{person.email || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default PeopleInRoom;
