import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Package, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Rental {
  id: string;
  resource: { name: string, depositAmount: number, rentPerDay: number };
  status: string;
  startDate: string;
  endDate: string;
  fineAmount: number;
}

interface Item {
  id: string;
  name: string;
  category: string;
  rentPerDay: number;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'rentals' | 'items' | 'requests'>('rentals');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [resRentals, resItems] = await Promise.all([
          api.get('/rentals/my'),
          api.get('/resources/my')
        ]);
        setRentals(resRentals.data);
        setMyItems(resItems.data);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, any> = {
      REQUESTED: { bg: '#eeeeee', color: '#666666', icon: <Clock size={14} /> },
      ACTIVE: { bg: '#000000', color: '#ffffff', icon: <ArrowUpRight size={14} /> },
      COMPLETED: { bg: '#ffffff', color: '#000000', border: '1px solid #000', icon: <CheckCircle size={14} /> },
      LATE: { bg: '#000000', color: '#ffffff', icon: <AlertCircle size={14} /> },
    };
    const s = styles[status] || styles.REQUESTED;
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '20px', 
        fontSize: '0.75rem', 
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
        border: s.border || 'none'
      }}>
        {s.icon} {status}
      </span>
    );
  };

  if (authLoading || loading) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Loading your dashboard...</div>;
  if (!user) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Please log in to view your dashboard.</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name || 'User'}</p>
        </div>
        <div className="card" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wallet Balance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{Number(user.walletBalance || 0).toFixed(2)}</div>
          </div>
          <button className="primary" style={{ padding: '0.5rem' }}><Package size={20} /></button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        {(['rentals', 'items', 'requests'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '1rem 0',
              borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
              borderRadius: 0,
              color: activeTab === tab ? '#000' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? 700 : 500,
              textTransform: 'capitalize',
              fontSize: '1rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'rentals' && (
          <div>
            {!rentals || rentals.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <Package size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>You haven't rented any items yet.</p>
                <Link to="/explore" style={{ color: '#000', fontWeight: 600, display: 'block', marginTop: '1rem' }}>Explore Resources</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {rentals.map(rental => (
                  <div key={rental.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: 'var(--radius)' }}>
                        <ArrowDownLeft size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{rental.resource?.name || 'Unknown Item'}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {rental.startDate ? new Date(rental.startDate).toLocaleDateString() : ''} — {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : ''}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cost</div>
                        <div style={{ fontWeight: 600 }}>₹{rental.resource?.rentPerDay || 0} / day</div>
                      </div>
                      <StatusBadge status={rental.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Your Shared Resources</h3>
              <button className="primary" onClick={() => navigate('/list-resource')}>+ List New Item</button>
            </div>
            {!myItems || myItems.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p>You haven't shared any items yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {myItems.map(item => (
                    <div key={item.id} className="card">
                        <h4 style={{ marginBottom: '0.5rem' }}>{item.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{item.category}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>₹{item.rentPerDay}/day</div>
                        <button className="secondary" style={{ fontSize: '0.8rem' }}>Manage</button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
           <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>No pending requests for your items.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
