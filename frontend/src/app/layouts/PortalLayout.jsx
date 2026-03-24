import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { trackEvent } from '../../services/analytics/analyticsService';
import brandWordmark from '../../assets/branding/lifewood-icon-text.png';
import './PortalLayout.css';

const MENU_ITEMS = [
  { label: 'Dashboard', to: '/portal' },
  { label: 'Applicants', to: '/portal/applicants' },
  { label: 'Users', to: '/portal/users' },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const notificationsRef = useRef(null);
  const headerAccountRef = useRef(null);
  const sidebarAccountRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    notifications,
    unreadCount: unreadNotifications,
    markAllRead: markAllNotificationsRead,
    markOneRead: markNotificationRead,
    markOneUnread: markNotificationUnread,
    deleteOne: deleteNotification,
  } = useNotifications({ enabled: Boolean(user) });

  const displayName = useMemo(() => {
    if (!user?.username) {
      return 'Portal User';
    }

    return user.username;
  }, [user?.username]);

  const initials = useMemo(() => {
    const chunks = displayName.split(/[._\s-]+/).filter(Boolean);
    const value = chunks.slice(0, 2).map((item) => item[0]).join('').toUpperCase();
    return value || 'LW';
  }, [displayName]);

  const userCard = useMemo(
    () => ({
      name: displayName,
      role: user?.role || 'USER',
      email: user?.username || '',
    }),
    [displayName, user?.role, user?.username],
  );

  const handleLogout = () => {
    setShowLogoutModal(false);
    setUserMenuAnchor(null);
    logout();
  };

  const isSidebarMenuOpen = userMenuAnchor === 'sidebar';
  const isHeaderMenuOpen = userMenuAnchor === 'header';

  const toggleUserMenu = (anchor) => {
    setUserMenuAnchor((prev) => (prev === anchor ? null : anchor));
  };

  const handleNotificationsToggle = () => {
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);
    trackEvent('portal_notifications_toggle', {
      section: 'portal_topbar',
      open: nextOpen,
      unreadCount: unreadNotifications,
    });
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllNotificationsRead();
      trackEvent('portal_notifications_mark_all_read', {
        section: 'portal_topbar',
        unreadCountBefore: unreadNotifications,
      });
    } catch {
      trackEvent('portal_notifications_mark_all_read_failed', {
        section: 'portal_topbar',
      });
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      trackEvent('portal_notification_mark_read', {
        section: 'portal_topbar',
        notificationId,
      });
    } catch {
      trackEvent('portal_notification_mark_read_failed', {
        section: 'portal_topbar',
        notificationId,
      });
    }
  };

  const handleMarkNotificationUnread = async (notificationId) => {
    try {
      await markNotificationUnread(notificationId);
      trackEvent('portal_notification_mark_unread', {
        section: 'portal_topbar',
        notificationId,
      });
    } catch {
      trackEvent('portal_notification_mark_unread_failed', {
        section: 'portal_topbar',
        notificationId,
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      trackEvent('portal_notification_delete', {
        section: 'portal_topbar',
        notificationId,
      });
    } catch {
      trackEvent('portal_notification_delete_failed', {
        section: 'portal_topbar',
        notificationId,
      });
    }
  };

  const renderUserMenu = (menuClassName) => (
    <div className={`portal-user-menu ${menuClassName}`} role="menu" aria-label="User options">
      <div className="portal-user-menu-profile" aria-hidden="true">
        <p className="portal-user-menu-name">{userCard.name}</p>
        <p className="portal-user-menu-role">{userCard.role}</p>
      </div>
      <div className="portal-user-menu-divider" role="separator" />
      <button
        type="button"
        className="portal-user-menu-item"
        onClick={() => {
          setUserMenuAnchor(null);
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
  );

  useEffect(() => {
    if (!userMenuAnchor) {
      return;
    }

    const handlePointerDown = (event) => {
      const isInHeaderMenu = headerAccountRef.current?.contains(event.target);
      const isInSidebarMenu = sidebarAccountRef.current?.contains(event.target);

      if (!isInHeaderMenu && !isInSidebarMenu) {
        setUserMenuAnchor(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [userMenuAnchor]);

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!notificationsRef.current?.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [showNotifications]);

  return (
    <div className="portal-layout">
      <aside className={`portal-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="portal-logo-wrap">
          <Link
            to="/portal"
            className="portal-logo-link"
            aria-label="Go to dashboard"
            onClick={() => setMenuOpen(false)}
          >
            <img src={brandWordmark} alt="Lifewood" className="portal-logo" />
          </Link>
        </div>

        <nav className="portal-nav" aria-label="Main Menu">
          <p className="portal-nav-title">Main Menu</p>
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/portal'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `portal-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        <div className="portal-user-block" ref={sidebarAccountRef}>
          <button
            type="button"
            className={`portal-user-card portal-user-card--trigger ${isSidebarMenuOpen ? 'is-open' : ''}`}
            aria-label="Open account menu"
            aria-expanded={isSidebarMenuOpen}
            aria-haspopup="menu"
            onClick={() => toggleUserMenu('sidebar')}
          >
            <span className="portal-user-card-main">
              <span className="portal-user-avatar" aria-hidden="true">
                {initials}
              </span>
              <span>
                <span className="portal-user-name">{userCard.name}</span>
                <span className="portal-user-role">{userCard.role}</span>
              </span>
            </span>
            <span className="portal-user-card-chevron" aria-hidden="true">
              ▾
            </span>
          </button>

          {isSidebarMenuOpen && renderUserMenu('portal-user-menu--sidebar')}
        </div>
      </aside>

      <div className="portal-content-area">
        <header className="portal-topbar">
          <button
            type="button"
            className={`portal-menu-btn ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="portal-menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div className="portal-topbar-right">
            <div className="portal-notification-wrap" ref={notificationsRef}>
              <button
                type="button"
                className="portal-notification-btn"
                aria-label="Notifications"
                aria-expanded={showNotifications}
                aria-haspopup="menu"
                onClick={handleNotificationsToggle}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9.5 19.5C9.9 20.7 10.9 21.5 12 21.5C13.1 21.5 14.1 20.7 14.5 19.5M6 9.5C6 6.2 8.4 3.5 12 3.5C15.6 3.5 18 6.2 18 9.5V13.2L19.4 15.8C19.7 16.4 19.3 17.1 18.6 17.1H5.4C4.7 17.1 4.3 16.4 4.6 15.8L6 13.2V9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {unreadNotifications > 0 ? (
                  <span className="portal-notification-badge">{unreadNotifications}</span>
                ) : null}
              </button>

              {showNotifications && (
                <div
                  className="portal-notification-menu"
                  role="menu"
                  aria-label="Recent notifications"
                >
                  <div className="portal-notification-menu-head">
                    <p>Notifications</p>
                    <button
                      type="button"
                      className="portal-notification-mark-all"
                      onClick={handleMarkAllNotificationsRead}
                      disabled={unreadNotifications === 0}
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="portal-notification-list">
                    {notifications.map((item) => (
                      <article
                        key={item.id}
                        className={`portal-notification-item ${item.read ? 'is-read' : ''}`}
                      >
                        <div className="portal-notification-item-head">
                          <span
                            className={`portal-notification-type portal-notification-type--${(item.type || 'other').toLowerCase()}`}
                          >
                            {item.type || 'Notification'}
                          </span>
                        </div>
                        <p className="portal-notification-title">{item.title}</p>
                        <p className="portal-notification-message">{item.message}</p>
                        <div className="portal-notification-actions">
                          {!item.read ? (
                            <button
                              type="button"
                              className="portal-notification-read-btn"
                              onClick={() => handleMarkNotificationRead(item.id)}
                            >
                              Mark as read
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="portal-notification-read-btn"
                              onClick={() => handleMarkNotificationUnread(item.id)}
                            >
                              Mark as unread
                            </button>
                          )}
                          <button
                            type="button"
                            className="portal-notification-delete-btn"
                            onClick={() => handleDeleteNotification(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="portal-header-account" ref={headerAccountRef}>
              <button
                type="button"
                className="portal-header-account-btn"
                aria-label="Open account menu"
                aria-expanded={isHeaderMenuOpen}
                aria-haspopup="menu"
                onClick={() => toggleUserMenu('header')}
              >
                <span className="portal-user-avatar portal-user-avatar--sm" aria-hidden="true">
                  {initials}
                </span>
              </button>

              {isHeaderMenuOpen && renderUserMenu('portal-user-menu--header')}
            </div>
          </div>
        </header>
        <main className="portal-main">
          <div key={location.pathname} className="portal-animate-in">
            <Outlet />
          </div>
        </main>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="portal-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

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
