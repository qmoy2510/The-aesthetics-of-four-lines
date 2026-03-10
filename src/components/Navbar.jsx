import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Activity, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '홈', path: '/', icon: <Music className="w-4 h-4" /> },
        { name: '지판 학습', path: '/fretboard', icon: <Activity className="w-4 h-4" /> },
        { name: '음계 매칭', path: '/note-matching', icon: <BookOpen className="w-4 h-4" /> },
        { name: '악보 퀴즈', path: '/sheet-music', icon: <Music className="w-4 h-4" /> },
    ];

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
                    <div className="hidden-mobile">
                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontWeight: 600,
                                        fontSize: '1.05rem',
                                        color: location.pathname === link.path ? 'white' : 'var(--text-secondary)',
                                        transition: 'color 0.3s ease',
                                        borderBottom: location.pathname === link.path ? '2px solid var(--primary)' : '2px solid transparent',
                                        paddingBottom: '0.25rem'
                                    }}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ color: 'var(--text-primary)', zIndex: 60, display: 'block' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '80px',
                        left: '0',
                        right: '0',
                        height: 'calc(100vh - 80px)',
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        backgroundColor: '#022c22', // Emerald
                        zIndex: 9999,
                        borderTop: '1px solid var(--glass-border)'
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                fontSize: '1.25rem', fontWeight: 500,
                                color: location.pathname === link.path ? '#10b981' : '#f8fafc',
                                textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                backgroundColor: location.pathname === link.path ? 'rgba(16, 185, 129, 0.4)' : 'rgba(30, 41, 59, 0.6)',
                                padding: '0.5rem', borderRadius: '0.375rem'
                            }}>
                                {link.icon}
                            </div>
                            <span style={{ color: location.pathname === link.path ? '#10b981' : '#f8fafc' }}>
                                {link.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
};

export default Navbar;
