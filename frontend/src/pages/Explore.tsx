import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, Filter, Tag, Info } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  rentPerDay: number;
  depositAmount: number;
  quantity: number;
}

const Explore: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        setResources(res.data);
      } catch (err) {
        console.error('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = ['All', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Explore Resources</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              style={{ paddingLeft: '3rem' }} 
              placeholder="Search by name or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} color="var(--text-muted)" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading items...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredResources.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={12} /> {item.category}
                </span>
                <span style={{ fontWeight: 700 }}>₹{item.rentPerDay}/day</span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
              </p>
              <div style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deposit</div>
                  <div style={{ fontWeight: 600 }}>₹{item.depositAmount}</div>
                </div>
                <Link to={`/resources/${item.id}`}>
                  <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={16} /> Details
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {filteredResources.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              No items found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
