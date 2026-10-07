import { useEffect, useState } from 'react';

import axios from '../services/axiosClient';

import '../styles/Room.css';

interface Room {
    id: string;
    number: number;
    people: number;
    occupancy: number;
    status: string;
}

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);

                const response = await axios.get('/dashboard/room');

                console.log('Rooms:', response.data);

                setRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                setError('Failed to load rooms.');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const totalPeople = rooms.reduce((total, room) => total + room.people, 0);

    const openRooms = rooms.filter((room) => room.status.toUpperCase() === 'OPEN').length;

    return (
        <div className="rooms-page">
            {/* Header */}
            <div className="rooms-header">
                <div>
                    <h1>Rooms</h1>
                    <p>Manage and monitor gallery rooms</p>
                </div>

                <button className="add-room-button">+ Add Room</button>
            </div>

            {/* Statistics */}
            <div className="rooms-stats">
                <div className="room-stat-card">
                    <div className="room-stat-icon blue">🚪</div>

                    <div>
                        <p>Total Rooms</p>
                        <h2>{rooms.length}</h2>
                    </div>
                </div>

                <div className="room-stat-card">
                    <div className="room-stat-icon green">👥</div>

                    <div>
                        <p>People in Rooms</p>
                        <h2>{totalPeople}</h2>
                    </div>
                </div>

                <div className="room-stat-card">
                    <div className="room-stat-icon orange">🏛️</div>

                    <div>
                        <p>Open Rooms</p>
                        <h2>{openRooms}</h2>
                    </div>
                </div>
            </div>

            {/* Room table */}
            <section className="rooms-section">
                <div className="rooms-section-header">
                    <h2>Gallery Rooms</h2>

                    <span>{rooms.length} rooms</span>
                </div>

                {loading && <div className="rooms-message">Loading rooms...</div>}

                {error && <div className="rooms-message rooms-error">{error}</div>}

                {!loading && !error && (
                    <div className="rooms-table-wrapper">
                        <table className="rooms-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>People</th>
                                    <th>Occupancy</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="empty-rooms">
                                            No rooms found.
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.map((room) => (
                                        <tr key={room.id}>
                                            {/* Room */}
                                            <td>
                                                <div className="room-name">
                                                    <span className="room-icon">🚪</span>

                                                    <span>Room {room.number}</span>
                                                </div>
                                            </td>

                                            {/* People */}
                                            <td>
                                                <span className="people-count">👥 {room.people}</span>
                                            </td>

                                            {/* Occupancy */}
                                            <td>
                                                <span className="occupancy-count">{room.occupancy}</span>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span className={`room-status ${room.status.toLowerCase()}`}>
                                                    {room.status}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td>
                                                <button className="view-room-button">View</button>
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

export default Rooms;
