import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../app/providers/useAuth';

const MotionArticle = motion.article;

export default function ProfileQuickCard() {
  const { user } = useAuth();

  return (
    <MotionArticle
      className="profile-quick-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="profile-quick-role">{user?.role || 'Administrator'}</p>
      <h2>{user?.username || 'Portal User'}</h2>
      <p className="profile-quick-email">{user?.username || 'No email provided'}</p>
      <div className="profile-quick-hover">
        <Link to="/portal/profile/edit" className="btn btn-saffron">
          Edit Profile
        </Link>
      </div>
    </MotionArticle>
  );
}
