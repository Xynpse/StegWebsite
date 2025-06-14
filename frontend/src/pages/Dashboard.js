import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { BsLockFill, BsLock, BsPlusCircle, BsLightningCharge } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/steg_rooms', { withCredentials: true })
      .then(res => setRooms(res.data))
      .catch(() => setRooms([]));

    axios.get('http://localhost:5000/api/current_user', { withCredentials: true })
    .then(res => setCurrentUser(res.data))
    .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getCoverImageSrc = (room) => {
    if (!room.cover_image) return null;
    const normalized = room.cover_image.replace(/\\/g, '/');
    if (normalized.startsWith('data:image')) return normalized;
    if (normalized.match(/^[A-Za-z0-9+/=]+$/)) return `data:image/png;base64,${normalized}`;
    if (normalized.startsWith('uploads/')) return `http://localhost:5000/${normalized}`;
    if (!normalized.startsWith('http') && !normalized.startsWith('/uploads/')) return `http://localhost:5000/uploads/${normalized}`;
    return normalized;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Stego Dashboard</h1>
        <div className="user-info">
          {currentUser && (
            <span className="user-email">{currentUser.email}</span>
          )}
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      <Row>
        {rooms.map((room) => (
          <Col key={room.id} md={4} className="mb-4">
            <Card className="room-card" onClick={() => navigate(`/room/${room.id}`)}>
              <div className="room-image-container">
                {getCoverImageSrc(room) ? (
                  <img src={getCoverImageSrc(room)} alt="cover" className="room-image" />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className="room-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="room-name">{room.name || 'Untitled'}</h3>
                  <div className="encryption-status">
                    <div className={`status-dot ${room.is_encrypted ? 'encrypted' : 'unencrypted'}`} />
                    {room.is_encrypted && (
                      room.is_key_stored ? (
                        <BsLockFill color="var(--danger-color)" size={16} />
                      ) : (
                        <BsLock color="var(--danger-color)" size={16} />
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="action-buttons">
        <button className="action-button create" onClick={() => navigate('/create')}>
          <BsPlusCircle size={24} />
          <span className="action-button-text">Create Stego</span>
        </button>
        <button className="action-button quick" onClick={() => navigate('/quick-stego')}>
          <BsLightningCharge size={24} />
          <span className="action-button-text">Quick Stego</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard; 