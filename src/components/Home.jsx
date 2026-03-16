import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BookOpen, Music, CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ title, description, icon, path, delay }) => (
    <div className={`glass-card animate-fade-in delay-${delay}`} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
            background: 'var(--primary-glow)',
            width: '60px', height: '60px',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flexGrow: 1 }}>{description}</p>
        <Link to={path} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginTop: 'auto' }} className="feature-link">
            바로 시작하기 <ArrowRight size={18} />
        </Link>
        <style>{`
      .feature-link:hover { color: var(--accent) !important; text-decoration: underline; }
    `}</style>
    </div>
);

const Home = () => {
    return (
        <div style={{ width: '100%' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center',
                paddingTop: '5rem', paddingBottom: '3rem',
                position: 'relative'
            }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
                    <div className="animate-fade-in" style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: 'var(--glass-highlight)', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', color: 'var(--accent)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                        베이스 기타 완벽 가이드
                    </div>
                    <h1 className="animate-fade-in delay-100" style={{ fontSize: 'min(4.5rem, 12vw)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        베이스 기타의 <br />
                        <span className="text-gradient">모든 것을 마스터하세요</span>
                    </h1>
                    <p className="animate-fade-in delay-200" style={{ color: 'var(--text-secondary)', fontSize: 'min(1.25rem, 5vw)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
                        지판의 음계를 완벽하게 외우고, 두뇌와 손가락을 일치시키는 혁신적인 인터랙티브 학습 플랫폼입니다.
                    </p>

                    <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link to="/fretboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            지판 학습 시작하기 <ArrowRight size={20} />
                        </Link>
                        <Link to="/note-matching" className="btn btn-glass" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            음계 퀴즈 풀기
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 0', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--glass-border)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>학습 기능</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>단계별로 베이스 지판을 정복할 수 있는 최적화된 도구들을 제공합니다.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            title="베이스 지판 학습"
                            description="인터랙티브 가상 지판을 통해 E, A, D, G 줄의 12프렛까지 모든 음계를 시각적으로 확인하고 외울 수 있습니다."
                            icon={<Activity color="var(--primary)" size={32} />}
                            path="/fretboard"
                            delay="100"
                        />
                        <FeatureCard
                            title="음계 매칭 퀴즈"
                            description="영어로 된 코드(C, D, E 등)를 보고 솔페지(도, 레, 미 등)를 빠르고 정확하게 맞추는 훈련을 진행합니다."
                            icon={<BookOpen color="var(--accent)" size={32} />}
                            path="/note-matching"
                            delay="200"
                        />
                        <FeatureCard
                            title="악보 읽기 퀴즈"
                            description="낮은자리표(Bass Clef)를 보고 정확한 음계를 읽어내는 초견 능력을 기릅니다. 난이도 별로 음표 수를 조절하며 도전해보세요."
                            icon={<Music color="var(--success)" size={32} />}
                            path="/sheet-music"
                            delay="300"
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>왜 네 줄의 미학 인가요?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '900px' }}>
                        {[
                            "직관적인 시각적 피드백",
                            "모바일/데스크탑 완벽 지원",
                            "다크 모드로 눈이 편안함",
                            "설치가 필요없는 웹 기반"
                        ].map((benefit, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <CheckCircle2 color="var(--success)" />
                                <span style={{ fontWeight: 500 }}>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
