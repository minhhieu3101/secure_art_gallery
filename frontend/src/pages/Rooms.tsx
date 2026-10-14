/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import axiosClient from "../services/axiosClient";
import "../styles/Room.css";

type RoomStatus = "open" | "closed";

interface Room {
  id?: string;
  number: number;
  people: number;
  occupancy: number;
  status: RoomStatus | string;
}

interface RoomForm {
  number: number | "";
  occupancy: number | "";
}

const initialForm: RoomForm = {
  number: "",
  occupancy: 50,
};

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }

    if (error.response?.status === 401) {
      return "Please log in again.";
    }

    if (error.response?.status === 403) {
      return "You need admin permission to perform this action.";
    }

    return `${fallback} (HTTP ${
      error.response?.status ?? "network error"
    }).`;
  }

  return fallback;
}

function normalizeRooms(responseData: unknown): Room[] {
  let data: unknown = responseData;

  if (
    data &&
    typeof data === "object" &&
    "data" in data
  ) {
    data = (data as { data: unknown }).data;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? item.roomId ?? item.number ?? ""),
    number: Number(item.number ?? 0),
    people: Number(item.people ?? item.peopleCount ?? 0),
    occupancy: Number(item.occupancy ?? item.capacity ?? 0),
    status: String(item.status ?? "open").toLowerCase(),
  }));
}

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState<RoomForm>(initialForm);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [statusError, setStatusError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setPageError("");

      const response = await axiosClient.get("/dashboard/room");
      setRooms(normalizeRooms(response.data));
    } catch (error: unknown) {
      console.error("Failed to fetch rooms:", error);
      setPageError(getErrorMessage(error, "Failed to load rooms."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const totalRooms = rooms.length;

  const totalPeople = rooms.reduce(
    (total, room) => total + room.people,
    0,
  );

  const openRooms = rooms.filter(
    (room) => room.status === "open",
  ).length;

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value === "" ? "" : Number(value),
    }));

    setFormError("");
    setSuccessMessage("");
  };

  const openAddModal = () => {
    setForm(initialForm);
    setFormError("");
    setSuccessMessage("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    if (saving) return;

    setIsAddModalOpen(false);
    setFormError("");
  };

  const handleAddRoom = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const { number, occupancy } = form;

    if (
      number === "" ||
      !Number.isInteger(number) ||
      number < 100 ||
      number > 999
    ) {
      setFormError("Room number must be a 3-digit number.");
      return;
    }

    if (
      occupancy === "" ||
      !Number.isInteger(occupancy) ||
      occupancy < 1
    ) {
      setFormError("Maximum capacity must be a positive integer.");
      return;
    }

    const duplicate = rooms.some(
      (room) => room.number === number,
    );

    if (duplicate) {
      setFormError(`Room ${number} already exists.`);
      return;
    }

    setSaving(true);

    try {
      await axiosClient.post("/room/createRoom", {
        number,
        occupancy,
      });

      setIsAddModalOpen(false);
      setForm(initialForm);
      setSuccessMessage(`Room ${number} was created successfully.`);

      await fetchRooms();
    } catch (error: unknown) {
      console.error("Failed to create room:", error);
      setFormError(getErrorMessage(error, "Failed to create room."));
    } finally {
      setSaving(false);
    }
  };

  const openStatusModal = (room: Room) => {
    setSelectedRoom(room);
    setStatusError("");
  };

  const closeStatusModal = () => {
    if (updatingStatus) return;

    setSelectedRoom(null);
    setStatusError("");
  };

  const handleChangeStatus = async (status: RoomStatus) => {
    if (!selectedRoom || updatingStatus) return;

    if (selectedRoom.status === status) {
      setStatusError(`This room is already ${status}.`);
      return;
    }

    setUpdatingStatus(true);
    setStatusError("");
    setPageError("");
    setSuccessMessage("");

    try {
      await axiosClient.patch("/room/changeStatus", {
        number: selectedRoom.number,
        status,
      });

      const roomNumber = selectedRoom.number;

      setSelectedRoom(null);
      setSuccessMessage(
        `Room ${roomNumber} is now ${status}.`,
      );

      await fetchRooms();
    } catch (error: unknown) {
      console.error("Failed to change room status:", error);
      setStatusError(
        getErrorMessage(error, "Failed to update room status."),
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const isRoomOpen = (status: string) => status === "open";

  return (
    <div className="rooms-page">
      <header className="rooms-page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage and monitor gallery rooms</p>
        </div>

        <button
          type="button"
          className="rooms-add-button"
          onClick={openAddModal}
        >
          + Add Room
        </button>
      </header>

      {pageError && (
        <div className="rooms-alert rooms-alert-error">
          {pageError}
          <button
            type="button"
            onClick={() => void fetchRooms()}
          >
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rooms-alert rooms-alert-success">
          {successMessage}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setSuccessMessage("")}
          >
            ×
          </button>
        </div>
      )}

      <section className="rooms-stats">
        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-blue">
            🚪
          </div>
          <div>
            <p>Total Rooms</p>
            <h2>{totalRooms}</h2>
          </div>
        </div>

        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-green">
            👥
          </div>
          <div>
            <p>People in Rooms</p>
            <h2>{totalPeople}</h2>
          </div>
        </div>

        <div className="rooms-stat-card">
          <div className="rooms-stat-icon rooms-stat-icon-orange">
            🏛️
          </div>
          <div>
            <p>Open Rooms</p>
            <h2>{openRooms}</h2>
          </div>
        </div>
      </section>

      <section className="rooms-table-card">
        <div className="rooms-table-header">
          <h2>Gallery Rooms</h2>
          <span>
            {totalRooms} {totalRooms === 1 ? "room" : "rooms"}
          </span>
        </div>

        {loading ? (
          <div className="rooms-empty-state">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="rooms-empty-state">
            No rooms found. Select “Add Room” to create one.
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
                {rooms.map((room) => (
                  <tr key={room.id || room.number}>
                    <td>
                      <div className="rooms-room-cell">
                        <div className="rooms-room-icon">🚪</div>
                        <strong>Room {room.number}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="rooms-people-count">
                        👥 {room.people}
                      </span>
                    </td>

                    <td>{room.occupancy}</td>

                    <td>
                      <span
                        className={`rooms-status-badge ${
                          isRoomOpen(room.status)
                            ? "rooms-status-open"
                            : "rooms-status-closed"
                        }`}
                      >
                        {room.status}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isAddModalOpen && (
        <div
          className="room-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAddModal();
            }
          }}
        >
          <section
            className="room-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-modal-title"
          >
            <div className="room-modal-header">
              <div>
                <h2 id="room-modal-title">Add New Room</h2>
                <p>Create a room for your gallery.</p>
              </div>

              <button
                type="button"
                className="room-modal-close"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRoom}>
              <div className="room-form-group">
                <label htmlFor="room-number">Room Number</label>
                <input
                  id="room-number"
                  name="number"
                  type="number"
                  min={100}
                  max={999}
                  step={1}
                  placeholder="e.g. 106"
                  value={form.number}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="room-form-group">
                <label htmlFor="room-occupancy">
                  Maximum Capacity
                </label>
                <input
                  id="room-occupancy"
                  name="occupancy"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 50"
                  value={form.occupancy}
                  onChange={handleFormChange}
                  required
                />
                <p className="room-form-hint">
                  Maximum number of people allowed in this room.
                </p>
              </div>

              <div className="room-form-info">
                New rooms start with 0 people. The backend
                determines the initial room status.
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
                  {saving ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedRoom && (
        <div
          className="room-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStatusModal();
            }
          }}
        >
          <section
            className="room-status-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-status-title"
          >
            <div className="room-status-header">
              <div>
                <h2 id="room-status-title">Change Room Status</h2>
                <p>Room {selectedRoom.number}</p>
              </div>

              <button
                type="button"
                className="room-modal-close"
                onClick={closeStatusModal}
                disabled={updatingStatus}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="room-status-current">
              Current status
              <span
                className={`rooms-status-badge ${
                  isRoomOpen(selectedRoom.status)
                    ? "rooms-status-open"
                    : "rooms-status-closed"
                }`}
              >
                {selectedRoom.status}
              </span>
            </div>

            {selectedRoom.people > 0 &&
              selectedRoom.status === "open" && (
                <p className="room-status-warning">
                  This room currently has {selectedRoom.people}{" "}
                  {selectedRoom.people === 1 ? "person" : "people"}.
                  Check that the room is empty before closing it.
                </p>
              )}

            {statusError && (
              <div className="room-form-error" role="alert">
                {statusError}
              </div>
            )}

            <div className="room-status-actions">
              <button
                type="button"
                className="room-status-open-button"
                disabled={
                  updatingStatus || selectedRoom.status === "open"
                }
                onClick={() => void handleChangeStatus("open")}
              >
                {updatingStatus ? "Updating..." : "Open Room"}
              </button>

              <button
                type="button"
                className="room-status-close-button"
                disabled={
                  updatingStatus || selectedRoom.status === "closed"
                }
                onClick={() => void handleChangeStatus("closed")}
              >
                {updatingStatus ? "Updating..." : "Close Room"}
              </button>

              <button
                type="button"
                className="room-status-cancel-button"
                disabled={updatingStatus}
                onClick={closeStatusModal}
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Rooms;
