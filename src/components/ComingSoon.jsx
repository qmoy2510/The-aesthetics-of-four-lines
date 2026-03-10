import React from 'react';
import { Hammer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ title = "새로운 기능", description = "더 나은 베이스 기타 연습 경험을 위해 이 기능을 열심히 준비하고 있습니다. 곧 추가될 예정이니 기대해 주세요!" }) => {
    return (
        <div className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}>
                    <Hammer size={40} color="var(--primary)" />
                </div>

                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {title}
                    </h1>
                    <div style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                        개발 중 (Coming Soon)
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {description}
                    </p>
                </div>

                <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <ArrowLeft size={18} />
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;
