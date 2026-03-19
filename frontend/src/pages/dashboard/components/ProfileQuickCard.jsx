import { Link } from 'react-router-dom';

export default function ProfileQuickCard() {
  return (
    <article className="profile-quick-card">
      <p className="profile-quick-role">Administrator</p>
      <h2>Samantha Cruz</h2>
      <p className="profile-quick-email">samantha.cruz@lifewood.com</p>
      <div className="profile-quick-hover">
        <Link to="/portal/profile/edit" className="btn btn-saffron">
          Edit Profile
        </Link>
      </div>
    </article>
  );
}
