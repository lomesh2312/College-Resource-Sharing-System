import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, ShieldCheck, CreditCard, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {}
      <section style={{ padding: '6rem 0', textAlign: 'center', backgroundColor: '#fafafa' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
            Share Resources. <br /> Empower Your Campus.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            A secure digital platform for students to rent and borrow academic tools, electronics, and lab equipment.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/explore">
              <button className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Browse items</button>
            </Link>
            <Link to="/register">
              <button className="secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Start Sharing</button>
            </Link>
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}><Share2 size={32} /></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Peer-to-Peer</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Direct sharing between verified students within your college campus.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}><ShieldCheck size={32} /></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Secure Deposits</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Deposits are locked during the rental period to ensure item safety.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}><CreditCard size={32} /></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Clear Lifecycle</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Automated tracking of approvals, active rentals, and returns.</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}><Clock size={32} /></div>
              <h3 style={{ marginBottom: '0.5rem' }}>Late Detection</h3>
              <p style={{ color: 'var(--text-secondary)' }}>System automatically detects late returns and calculates fair fines.</p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--accent)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join the Sharing Revolution</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Start earning from your unused resources today.</p>
          <Link to="/register">
            <button style={{ backgroundColor: '#fff', color: '#000', padding: '1rem 3rem', border: 'none' }}>Get Started Now</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
