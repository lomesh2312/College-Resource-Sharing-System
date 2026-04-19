import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Package, Tag, DollarSign, Info, ArrowLeft, Send } from 'lucide-react';

const ListResource: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    rentPerDay: '',
    depositAmount: '',
    quantity: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/resources', {
        ...formData,
        rentPerDay: parseFloat(formData.rentPerDay),
        depositAmount: parseFloat(formData.depositAmount),
        quantity: parseInt(formData.quantity)
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to list resource');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Books', 'Tools', 'Calculators', 'Lab Equipment', 'Stationary', 'Other'];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '650px', marginTop: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="card" style={{ padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>List a Resource</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Share your tools and books with fellow students.</p>

        {error && (
          <div style={{ color: 'red', border: '1px solid red', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Item Name</label>
            <div style={{ position: 'relative' }}>
                <Package size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                type="text" 
                style={{ paddingLeft: '3rem' }}
                placeholder="e.g. Graphing Calculator TI-84" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
                <div style={{ position: 'relative' }}>
                    <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
                    <select 
                    style={{ paddingLeft: '3rem' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Quantity</label>
                <input 
                type="number" 
                min="1"
                placeholder="1" 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required 
                />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
            <textarea 
              rows={4}
              placeholder="Describe the condition, usage rules, etc." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rent per Day</label>
                <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                    type="number" 
                    step="0.01"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="0.00" 
                    value={formData.rentPerDay}
                    onChange={(e) => setFormData({...formData, rentPerDay: e.target.value})}
                    required 
                    />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Security Deposit</label>
                <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                    type="number" 
                    step="0.01"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="0.00" 
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
                    required 
                    />
                </div>
            </div>
          </div>

          <button type="submit" className="primary" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={loading}>
            {loading ? 'Listing...' : <><Send size={18} /> List Item Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListResource;
