/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getOpenedRooms, enterGallery, leaveGallery, enterRoom, leaveRoom, type Room } from '../services/eventService';
import '../styles/Event.css';

function Events() {
    const [email, setEmail] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);

    // Load opened rooms from backend
    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await getOpenedRooms();
                setRooms(data);
            } catch (error) {
                console.error('Failed to load rooms:', error);
            }
        };

        loadRooms();
    }, []);

    // Enter Gallery
    const handleEnterGallery = async () => {
        if (!email.trim()) {
            alert("Please enter a person's email.");
            return;
        }

        try {
            setLoading(true);

            await enterGallery(email.trim());

            alert('Person entered the gallery successfully.');
        } catch (error: any) {
            console.error('Enter gallery failed:', error);

            alert(error?.response?.data?.message || 'Failed to enter gallery.');
        } finally {
            setLoading(false);
        }
    };

    // Leave Gallery
    const handleLeaveGallery = async () => {
        if (!email.trim()) {
            alert("Please enter a person's email.");
            return;
        }

        try {
            setLoading(true);

            await leaveGallery(email.trim());

            alert('Person left the gallery successfully.');
        } catch (error: any) {
            console.error('Leave gallery failed:', error);

            alert(error?.response?.data?.message || 'Failed to leave gallery.');
        } finally {
            setLoading(false);
        }
    };

    // Enter Room
    const handleEnterRoom = async () => {
        if (!email.trim()) {
            alert("Please enter a person's email.");
            return;
        }

        if (!roomNumber) {
            alert('Please select a room.');
            return;
        }

        try {
            setLoading(true);

            await enterRoom(email.trim(), Number(roomNumber));

            alert('Person entered the room successfully.');
        } catch (error: any) {
            console.error('Enter room failed:', error);

            alert(error?.response?.data?.message || 'Failed to enter room.');
        } finally {
            setLoading(false);
        }
    };

    // Leave Room
    const handleLeaveRoom = async () => {
        if (!email.trim()) {
            alert("Please enter a person's email.");
            return;
        }

        if (!roomNumber) {
            alert('Please select a room.');
            return;
        }

        try {
            setLoading(true);

            await leaveRoom(email.trim(), Number(roomNumber));

            alert('Person left the room successfully.');
        } catch (error: any) {
            console.error('Leave room failed:', error);

            alert(error?.response?.data?.message || 'Failed to leave room.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="events-page">
            {/* Page Header */}
            <div className="events-header">
                <h1>Events</h1>
                <p>Manage gallery and room activities</p>
            </div>

            {/* Event Information */}
            <section className="event-card">
                <div className="event-card-header">
                    <h2>Event Information</h2>
                </div>

                <div className="event-form">
                    {/* Person Email */}
                    <div className="event-field">
                        <label htmlFor="person-email">Person Email</label>

                        <input
                            id="person-email"
                            type="email"
                            placeholder="Enter person's email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Room */}
                    <div className="event-field">
                        <label htmlFor="room-number">Room</label>

                        <select id="room-number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}>
                            <option value="">Select room</option>

                            {rooms.map((room) => (
                                <option key={room.id} value={room.number}>
                                    Room {room.number}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Event Actions */}
            <section className="event-card">
                <div className="event-card-header">
                    <h2>Event Actions</h2>
                </div>

                <div className="event-actions">
                    {/* Enter Gallery */}
                    <button
                        className="event-button enter"
                        onClick={handleEnterGallery}
                        disabled={loading || !email.trim()}
                    >
                        Enter Gallery
                    </button>

                    {/* Leave Gallery */}
                    <button
                        className="event-button leave"
                        onClick={handleLeaveGallery}
                        disabled={loading || !email.trim()}
                    >
                        Leave Gallery
                    </button>

                    {/* Enter Room */}
                    <button
                        className="event-button enter"
                        onClick={handleEnterRoom}
                        disabled={loading || !email.trim() || !roomNumber}
                    >
                        Enter Room
                    </button>

                    {/* Leave Room */}
                    <button
                        className="event-button leave"
                        onClick={handleLeaveRoom}
                        disabled={loading || !email.trim() || !roomNumber}
                    >
                        Leave Room
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Events;
