import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Calendar, Shield, Info, ArrowLeft, Send } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  rentPerDay: number;
  depositAmount: number;
  quantity: number;
  ownerId: string;
}

const ResourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/resources/${id}`);
        setResource(res.data);
      } catch (err) {
        console.error('Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    setBookingLoading(true);
    setError('');
    try {
      await api.post('/rentals/request', {
        resourceId: id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Check your balance and availability.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading details...</div>;
  if (!resource) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Resource not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={20} /> Back to explore
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '4rem', alignItems: 'start' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <span className="glass" style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                {resource.category}
             </span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantity Available: {resource.quantity}</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-1px' }}>{resource.name}</h1>

          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} /> Description
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{resource.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: 'var(--radius)' }}><Shield size={24} /></div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Safety Deposit</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{resource.depositAmount}</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: 'var(--radius)' }}><Calendar size={24} /></div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Rent</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{resource.rentPerDay}</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="card animate-fade-in" style={{ padding: '2.5rem', position: 'sticky', top: '100px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
               <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
               <h3 style={{ marginBottom: '0.5rem' }}>Request Sent!</h3>
               <p style={{ color: 'var(--text-secondary)' }}>Relocating to your dashboard...</p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Reserve for Rent</h3>

              {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Daily Rate</span>
                    <span>₹{resource.rentPerDay}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>Security Deposit</span>
                    <span>₹{resource.depositAmount}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="primary" 
                  style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                  disabled={bookingLoading || (user && user.id === resource.ownerId)}
                >
                  <Send size={18} /> {bookingLoading ? 'Processing...' : 'Submit Request'}
                </button>

                {user && user.id === resource.ownerId && (
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'red', textAlign: 'center' }}>
                    You cannot rent your own item.
                  </p>
                )}
                {!user && (
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Please <Link to="/login" style={{ color: '#000', fontWeight: 600 }}>login</Link> to reserve.
                  </p>
                )}
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ResourceDetails;
