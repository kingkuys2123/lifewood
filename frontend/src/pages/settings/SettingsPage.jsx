import SettingsNotifications from './components/SettingsNotifications';
import SettingsPanel from './components/SettingsPanel';
import { useSettingsData } from './hooks/useSettingsData';
import './styles/SettingsPage.css';

export default function SettingsPage() {
  const { controls, notifications } = useSettingsData();

  return (
    <section className="settings-page portal-animate-in">
      <h1 className="settings-title portal-page-title">Settings</h1>
      <div className="settings-grid">
        <SettingsPanel controls={controls} />
        <SettingsNotifications notifications={notifications} />
      </div>
    </section>
  );
}
