export default function ApplicantsSummary() {
  return (
    <div className="portal-page-summary">
      <p className="portal-page-title">Applicants</p>
      <p className="portal-page-description">
        Review incoming candidates and track important workflow updates.
      </p>
      <div className="portal-alert-list" role="status" aria-live="polite">
        <div className="portal-alert portal-alert--system">
          System update: applicant scoring model refreshed at 09:15.
        </div>
        <div className="portal-alert portal-alert--action">
          Important action: 5 applications are pending final approval.
        </div>
      </div>
    </div>
  );
}
