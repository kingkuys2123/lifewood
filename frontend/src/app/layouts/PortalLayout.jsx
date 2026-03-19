import { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import brandWordmark from '../../assets/branding/lifewood-icon-text.png';
import './PortalLayout.css';

const MENU_ITEMS = [
  { label: 'Dashboard', to: '/portal' },
  { label: 'Applicants', to: '/portal/applicants' },
  { label: 'Users', to: '/portal/users' },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = useMemo(
    () => ({
      name: 'Samantha Cruz',
      role: 'Super Admin',
      email: 'samantha.cruz@lifewood.com',
    }),
    [],
  );

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <div className="portal-layout">
      <aside className={`portal-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="portal-logo-wrap">
          <img src={brandWordmark} alt="Lifewood" className="portal-logo" />
        </div>

        <nav className="portal-nav" aria-label="Main Menu">
          <p className="portal-nav-title">Main Menu</p>
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/portal'}
              className={({ isActive }) =>
                `portal-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <p className="portal-nav-title portal-nav-title--settings">Settings</p>
          <NavLink
            to="/portal/settings"
            className={({ isActive }) =>
              `portal-nav-link ${isActive ? 'active' : ''}`
            }
          >
            Settings
          </NavLink>
        </nav>

        <div className="portal-user-block">
          <button
            type="button"
            className="portal-user-trigger"
            onClick={() => setShowUserMenu((prev) => !prev)}
          >
            <div>
              <p className="portal-user-name">{user.name}</p>
              <p className="portal-user-role">{user.role}</p>
            </div>
            <span className="portal-user-chevron">▾</span>
          </button>

          {showUserMenu && (
            <div className="portal-user-menu" role="menu" aria-label="User options">
              <button
                type="button"
                className="portal-user-menu-item"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/portal/profile/edit');
                }}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="portal-user-menu-item"
                onClick={() => setShowLogoutModal(true)}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="portal-content-area">
        <header className="portal-topbar">
          <button
            type="button"
            className="portal-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
          <p className="portal-user-email">{user.email}</p>
        </header>
        <main className="portal-main">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="portal-modal-backdrop" role="presentation">
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm log out"
          >
            <h2>Log out?</h2>
            <p>You will be redirected to the login portal.</p>
            <div className="portal-modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-forest" onClick={handleLogout}>
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

