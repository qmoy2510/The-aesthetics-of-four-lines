import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Activity, BookOpen, Menu, X, ChevronDown, Mic } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    const navCategories = [
        {
            title: '이론',
            icon: <BookOpen className="w-4 h-4" />,
            links: [
                { name: '지판 학습', path: '/fretboard', icon: <Activity className="w-4 h-4" /> },
                { name: '스케일 학습', path: '/scale-study', icon: <BookOpen className="w-4 h-4" /> },
                { name: '음계 매칭', path: '/note-matching', icon: <BookOpen className="w-4 h-4" /> },
                { name: '악보 퀴즈', path: '/sheet-music', icon: <Music className="w-4 h-4" /> },
            ]
        },
        {
            title: '실전',
            icon: <Music className="w-4 h-4" />,
            links: [
                { name: '음정 감지 연습', path: '/practice-pitch', icon: <Mic className="w-4 h-4" /> },
            ]
        }
    ];

    const isPathInNavLinks = (path, category) => {
        return category.links.some(link => link.path === path);
    };

    return (
        <>
            <nav
                className={`transition-all duration-300 ${isScrolled ? 'glass-panel shadow-lg' : 'bg-transparent'}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 50,
                    paddingTop: isScrolled ? '0.75rem' : '2.5rem',
                    paddingBottom: isScrolled ? '0.75rem' : '1.5rem',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
                    borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                    borderRadius: 0,
                    backgroundColor: isScrolled ? 'rgba(2, 44, 34, 0.8)' : 'transparent',
                    transition: 'all 0.3s ease',
                }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto', width: '100%', maxWidth: '1200px' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 60 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            borderRadius: '50%', padding: '0.5rem', display: 'flex'
                        }}>
                            <Music color="white" size={24} />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                            네 줄의 미학
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden-mobile" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', height: '100%' }}>
                            <Link
                                to="/"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    fontWeight: 600,
                                    fontSize: '1.05rem',
                                    color: location.pathname === '/' ? 'white' : 'var(--text-secondary)',
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                <Music className="w-4 h-4" />
                                홈
                            </Link>

                            {navCategories.map((category, idx) => (
                                <div
                                    key={idx}
                                    style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                    onMouseEnter={() => setActiveDropdown(idx)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            fontWeight: 600,
                                            fontSize: '1.05rem',
                                            color: isPathInNavLinks(location.pathname, category) || activeDropdown === idx ? 'white' : 'var(--text-secondary)',
                                            transition: 'color 0.3s ease',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '1rem 0' // Increase hit area
                                        }}
                                    >
                                        {category.icon}
                                        {category.title}
                                        <ChevronDown size={16} style={{
                                            transform: activeDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease'
                                        }} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: `translateX(-50%) translateY(${activeDropdown === idx ? '0' : '10px'})`,
                                        opacity: activeDropdown === idx ? 1 : 0,
                                        visibility: activeDropdown === idx ? 'visible' : 'hidden',
                                        transition: 'all 0.2s ease-out',
                                        background: 'rgba(2, 44, 34, 0.95)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.5rem',
                                        minWidth: '180px',
                                        boxShadow: 'var(--shadow-lg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}>
                                        {category.links.map(link => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: location.pathname === link.path ? 'white' : 'var(--text-secondary)',
                                                    background: location.pathname === link.path ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                                    textDecoration: 'none',
                                                    fontSize: '0.95rem',
                                                    fontWeight: location.pathname === link.path ? '600' : '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (location.pathname !== link.path) {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                        e.currentTarget.style.color = 'white';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (location.pathname !== link.path) {
                                                        e.currentTarget.style.background = 'transparent';
                                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                                    }
                                                }}
                                            >
                                                {link.icon}
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ color: 'var(--text-primary)', zIndex: 60, display: 'block', background: 'none', border: 'none' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: '#022c22', // Solid Emerald background
                        zIndex: 40,
                        paddingTop: '6rem', // clear header
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                        <Link
                            to="/"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                fontSize: '1.4rem', fontWeight: 600,
                                color: location.pathname === '/' ? '#10b981' : '#f8fafc',
                                textDecoration: 'none',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <Music size={24} />
                            홈
                        </Link>

                        {navCategories.map((category, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    fontSize: '1rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {category.icon}
                                    {category.title}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem' }}>
                                    {category.links.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                fontSize: '1.25rem', fontWeight: 500,
                                                color: location.pathname === link.path ? '#10b981' : '#f8fafc',
                                                textDecoration: 'none',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                backgroundColor: location.pathname === link.path ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ opacity: location.pathname === link.path ? 1 : 0.7 }}>
                                                {React.cloneElement(link.icon, { size: 20 })}
                                            </div>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
