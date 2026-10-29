/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import '../styles/Room.css';

interface Room {
  id: string;
  number: number;
  people: number;
  occupancy: number;
  status: string;
}

function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add Room modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [occupancy, setOccupancy] = useState('');
  const [formError, setFormError] = useState('');

  // Change Status modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState('open');

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.get('/dashboard/room');
      const data = response.data?.data ?? response.data;

      if (!Array.isArray(data)) {
        throw new Error('The server did not return a room list.');
      }

      setRooms(data);
    } catch (err: unknown) {
      console.error('Failed to load rooms:', err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Could not load rooms. Please try again.',
        );
      } else {
        setError(
          err instanceof Error ? err.message : 'Could not load rooms.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const totalRooms = rooms.length;

  const totalPeople = rooms.reduce(
    (total, room) => total + (Number(room.people) || 0),
    0,
  );

  const openRooms = rooms.filter(
    (room) => room.status?.toLowerCase() === 'open',
  ).length;

  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);
    setRoomNumber('');
    setOccupancy('');
    setFormError('');
  };

  const handleAddRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setError('');
    setSuccessMessage('');

    const number = Number(roomNumber);
    const capacity = Number(occupancy);

    if (
      !roomNumber.trim() ||
      !occupancy.trim() ||
      !Number.isInteger(number) ||
      number <= 0 ||
      !Number.isInteger(capacity) ||
      capacity <= 0
    ) {
      setFormError(
        'Enter a valid positive room number and occupancy.',
      );
      return;
    }

    const duplicate = rooms.some(
      (room) => Number(room.number) === number,
    );

    if (duplicate) {
      setFormError('This room number already exists.');
      return;
    }

    setSaving(true);

    try {
      await axiosClient.post('/room/createRoom', {
        number,
        occupancy: capacity,
      });

      setShowAddModal(false);
      setRoomNumber('');
      setOccupancy('');
      setSuccessMessage(`Room ${number} was created successfully.`);

      await fetchRooms();
    } catch (err: unknown) {
      console.error('Failed to create room:', err);

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setFormError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Could not create room. Please try again.',
        );
      } else {
        setFormError('Could not create room. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const openStatusModal = (room: Room) => {
    setSelectedRoom(room);
    setNewStatus(room.status?.toLowerCase() === 'closed' ? 'closed' : 'open');
    setFormError('');
    setError('');
    setSuccessMessage('');
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    if (saving) return;

    setShowStatusModal(false);
    setSelectedRoom(null);
    setFormError('');
  };

  const handleChangeStatus = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedRoom) {
      setFormError('Please select a room first.');
      return;
    }

    if (newStatus === selectedRoom.status?.toLowerCase()) {
      setFormError('Please select a different status.');
      return;
    }

    setSaving(true);
    setFormError('');
    setError('');
    setSuccessMessage('');

    try {
      await axiosClient.patch('/room/changeStatus', {
        number: selectedRoom.number,
        status: newStatus,
      });

      setShowStatusModal(false);
      setSuccessMessage(
        `Room ${selectedRoom.number} status changed to ${newStatus}.`,
      );
      setSelectedRoom(null);

      await fetchRooms();
    } catch (err: unknown) {
      console.error('Failed to change room status:', err);

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setFormError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Could not change room status. Please try again.',
        );
      } else {
        setFormError('Could not change room status. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    navigate(`/rooms/${room.id}/people`, {
      state: { roomNumber: room.number },
    });
  };

  return (
    <div className="rooms-page">
      <div className="rooms-page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage and monitor gallery rooms</p>
        </div>

        <button
          type="button"
          className="rooms-add-button"
          onClick={() => {
            setFormError('');
            setError('');
            setSuccessMessage('');
            setShowAddModal(true);
          }}
        >
          + Add Room
        </button>
      </div>

      {error && (
        <div className="rooms-alert rooms-alert-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void fetchRooms()}>
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rooms-alert rooms-alert-success" role="status">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      <div className="rooms-stats">
        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-blue">🚪</div>
          <div>
            <p>Total Rooms</p>
            <h2>{loading ? '—' : totalRooms}</h2>
          </div>
        </div>

        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-green">👥</div>
          <div>
            <p>People in Rooms</p>
            <h2>{loading ? '—' : totalPeople}</h2>
          </div>
        </div>

        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-orange">🏛️</div>
          <div>
            <p>Open Rooms</p>
            <h2>{loading ? '—' : openRooms}</h2>
          </div>
        </div>
      </div>

      <section className="rooms-table-card">
        <div className="rooms-table-header">
          <h2>Gallery Rooms</h2>
          <span>{loading ? 'Loading...' : `${totalRooms} rooms`}</span>
        </div>

        {loading ? (
          <div className="rooms-empty-state">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="rooms-empty-state">
            No rooms found. Click Add Room to create one.
          </div>
        ) : (
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
                {rooms.map((room) => {
                  const isOpen =
                    room.status?.toLowerCase() === 'open';

                  return (
                    <tr key={room.id}>
                      <td>
                        <button
                          type="button"
                          className="rooms-room-link"
                          onClick={() => handleRoomClick(room)}
                        >
                          <span className="rooms-room-icon">🚪</span>
                          <span>Room {room.number}</span>
                          <span className="rooms-room-link-icon">↗</span>
                        </button>
                      </td>

                      <td>{Number(room.people) || 0}</td>
                      <td>{Number(room.occupancy) || 0}</td>

                      <td>
                        <span
                          className={`rooms-status-badge ${
                            isOpen
                              ? 'rooms-status-open'
                              : 'rooms-status-closed'
                          }`}
                        >
                          {room.status || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="rooms-change-status-button"
                          onClick={() => openStatusModal(room)}
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Room modal — stays on the Rooms page */}
      {showAddModal && (
        <div
          className="room-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAddModal();
          }}
        >
          <section
            className="room-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-room-title"
          >
            <div className="room-modal-header">
              <div>
                <h2 id="add-room-title">Add New Room</h2>
                <p>Enter the room number and maximum occupancy.</p>
              </div>

              <button
                type="button"
                className="room-modal-close"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRoom}>
              <div className="room-form-group">
                <label htmlFor="room-number">Room Number</label>
                <input
                  id="room-number"
                  type="number"
                  min="1"
                  step="1"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  placeholder="e.g. 101"
                  required
                  autoFocus
                />
              </div>

              <div className="room-form-group">
                <label htmlFor="room-occupancy">Maximum Occupancy</label>
                <input
                  id="room-occupancy"
                  type="number"
                  min="1"
                  step="1"
                  value={occupancy}
                  onChange={(event) => setOccupancy(event.target.value)}
                  placeholder="e.g. 20"
                  required
                />
                <p className="room-form-hint">
                  Enter the maximum number of people allowed in this room.
                </p>
              </div>

              <div className="room-form-info">
                The new room will be created with its default status and
                occupancy count as configured by the backend.
              </div>

              {formError && (
                <div className="room-form-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="room-modal-footer">
                <button
                  type="button"
                  className="room-button room-button-secondary"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="room-button room-button-primary"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Change Status modal */}
      {showStatusModal && selectedRoom && (
        <div
          className="room-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStatusModal();
          }}
        >
          <section
            className="room-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-status-title"
          >
            <div className="room-modal-header">
              <div>
                <h2 id="change-status-title">Change Room Status</h2>
                <p>Update the status of this gallery room.</p>
              </div>

              <button
                type="button"
                className="room-modal-close"
                onClick={closeStatusModal}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleChangeStatus}>
              <div className="room-form-group">
                <label htmlFor="selected-room">Room Number</label>
                <input
                  id="selected-room"
                  type="text"
                  value={`Room ${selectedRoom.number}`}
                  readOnly
                />
              </div>

              <div className="room-form-group">
                <label htmlFor="room-status">New Status</label>
                <select
                  id="room-status"
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                  required
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {formError && (
                <div className="room-form-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="room-modal-footer">
                <button
                  type="button"
                  className="room-button room-button-secondary"
                  onClick={closeStatusModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="room-button room-button-primary"
                  disabled={
                    saving ||
                    newStatus === selectedRoom.status?.toLowerCase()
                  }
                >
                  {saving ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Rooms;
