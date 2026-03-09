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
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel shadow-lg' : 'bg-transparent'
                }`}
            style={{
                paddingTop: isScrolled ? '0.75rem' : '2.5rem',
                paddingBottom: isScrolled ? '0.75rem' : '1.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
                borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                borderRadius: 0,
                backgroundColor: isScrolled ? 'rgba(2, 44, 34, 0.8)' : 'transparent',
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ display: 'none' }} className="hidden-mobile">
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

                {/* Mobile menu toggle (Simplified for inline styles) */}
                <button
                    className="mobile-only"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ color: 'var(--text-primary)', zIndex: 60, display: 'block' }}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div
                    className="glass-panel animate-fade-in"
                    style={{
                        position: 'absolute', top: '100%', left: 0, right: 0,
                        padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        borderTop: '1px solid var(--glass-border)',
                        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
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
                                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-primary)',
                            }}
                        >
                            <div style={{
                                background: location.pathname === link.path ? 'var(--primary-glow)' : 'var(--glass-bg)',
                                padding: '0.5rem', borderRadius: 'var(--radius-sm)'
                            }}>
                                {link.icon}
                            </div>
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}

            {/* Adding a quick inline style for mobile responsiveness since we aren't using Tailwind fully */}
            <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: block !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
