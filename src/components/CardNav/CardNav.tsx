import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  NorthEast as ArrowIcon,
  BakeryDining,
  ShoppingBag,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import './CardNav.css';

interface CardNavLink {
  label: string;
  path: string;
  ariaLabel: string;
}

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

interface CardNavProps {
  items: CardNavItem[];
  totalItems: number;
  user: any;
  onSignInClick: () => void;
  onSignOut: () => void;
  mode: 'light' | 'dark';
  onToggleMode: () => void;
}

const CardNav: React.FC<CardNavProps> = ({
  items,
  totalItems,
  user,
  onSignInClick,
  onSignOut,
  mode,
  onToggleMode,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        void contentEl.offsetHeight; // force reflow

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out',
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 },
      '-=0.1'
    );

    return tl;
  }, [calculateHeight]);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [createTimeline, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded, calculateHeight, createTimeline]);

  const closeMenu = useCallback(() => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;
    setIsHamburgerOpen(false);
    tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
    tl.reverse();
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      closeMenu();
    }
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const handleSignIn = () => {
    closeMenu();
    onSignInClick();
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className="card-nav-container">
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''}`}
        style={mode === 'dark' ? {
          backgroundColor: 'rgba(34, 16, 21, 0.88)',
          borderColor: '#48232c',
          boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.45)',
          color: '#f5f0f1',
        } : undefined}
      >
        <div className="card-nav-top">
          {/* Hamburger */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMenu(); }}
            style={mode === 'dark' ? { color: '#f5f0f1' } : undefined}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          {/* Logo */}
          <div
            className="logo-container"
            onClick={() => handleNavigate('/')}
            role="link"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNavigate('/'); }}
          >
            {/* <BakeryDining className="logo-icon" /> */}
            <span className="logo-text" style={mode === 'dark' ? { color: '#f5f0f1' } : undefined}>
              Frosted Crusts By Hauwa
            </span>
          </div>

          {/* Right actions */}
          <div className="card-nav-actions">
            {/* Dark mode toggle */}
            <button
              className="card-nav-icon-button"
              onClick={onToggleMode}
              aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {mode === 'light' ? (
                <DarkMode style={{ fontSize: 20 }} />
              ) : (
                <LightMode style={{ fontSize: 20 }} />
              )}
            </button>

            {/* Cart */}
            <button
              className="card-nav-icon-button"
              onClick={() => handleNavigate('/cart')}
              aria-label="Shopping cart"
            >
              <ShoppingBag style={{ fontSize: 22 }} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>

            {/* CTA: Sign In or User Avatar */}
            {user ? (
              <button
                className="card-nav-icon-button"
                onClick={toggleMenu}
                aria-label="User menu"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                  />
                ) : (
                  <span style={{
                    width: 30, height: 30, borderRadius: '50%',
                    backgroundColor: '#ef3966', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700
                  }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <button
                className="card-nav-cta-button"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Expandable card content */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>

              {/* User info on account card */}
              {item.label === 'Account' && user && (
                <div className="nav-card-user-info">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className="nav-card-user-avatar"
                    />
                  ) : (
                    <div className="nav-card-user-avatar-fallback">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="nav-card-user-email">{user.email}</span>
                </div>
              )}

              <div className="nav-card-links">
                {item.links.map((lnk, i) => (
                  <button
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    onClick={() => {
                      if (lnk.path === '__signin__') {
                        handleSignIn();
                      } else if (lnk.path === '__signout__') {
                        onSignOut();
                        closeMenu();
                      } else {
                        handleNavigate(lnk.path);
                      }
                    }}
                    aria-label={lnk.ariaLabel}
                    style={{
                      color: 'inherit',
                      fontWeight: location.pathname === lnk.path ? 600 : 400,
                      opacity: location.pathname === lnk.path ? 1 : 0.85,
                    }}
                  >
                    <ArrowIcon className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
