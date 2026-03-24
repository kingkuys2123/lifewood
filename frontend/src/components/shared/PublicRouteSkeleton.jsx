import './PublicRouteSkeleton.css';

export default function PublicRouteSkeleton() {
  return (
    <section className="public-skeleton" aria-live="polite" aria-busy="true">
      <div className="public-skeleton__hero" />
      <div className="public-skeleton__content wrap">
        <div className="public-skeleton__line public-skeleton__line--wide" />
        <div className="public-skeleton__line" />
        <div className="public-skeleton__line public-skeleton__line--short" />
      </div>
    </section>
  );
}

