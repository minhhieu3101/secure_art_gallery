import "../styles/Dashboard.css";

function Dashboard() {
  const roomData = [
    {
      room: "Room A",
      people: 5,
      capacity: 10,
      status: "Open",
    },
    {
      room: "Room B",
      people: 3,
      capacity: 10,
      status: "Open",
    },
    {
      room: "Room C",
      people: 0,
      capacity: 15,
      status: "Open",
    },
    {
      room: "Main Hall",
      people: 0,
      capacity: 15,
      status: "Open",
    },
  ];

  const recentEvents = [
    {
      time: "2:31 PM",
      person: "John Smith",
      event: "Enter Room",
      room: "Room A",
    },
    {
      time: "2:28 PM",
      person: "Anna Lee",
      event: "Enter Gallery",
      room: "-",
    },
    {
      time: "2:20 PM",
      person: "David Kim",
      event: "Leave Room",
      room: "Room B",
    },
    {
      time: "2:15 PM",
      person: "David Kim",
      event: "Enter Room",
      room: "Room B",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div>
            <p>People in Gallery</p>
            <h2>12</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🚪</div>
          <div>
            <p>People in Rooms</p>
            <h2>8</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon navy">🏛️</div>
          <div>
            <p>Total Rooms</p>
            <h2>4</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div>
            <p>Available Capacity</p>
            <h2>32 / 50</h2>
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
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {roomData.map((room) => (
                  <tr key={room.room}>
                    <td>{room.room}</td>
                    <td>{room.people}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <span className="status-badge">{room.status}</span>
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
                  <th>Person</th>
                  <th>Event</th>
                  <th>Room</th>
                </tr>
              </thead>

              <tbody>
                {recentEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.time}</td>
                    <td>{event.person}</td>
                    <td>{event.event}</td>
                    <td>{event.room}</td>
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
