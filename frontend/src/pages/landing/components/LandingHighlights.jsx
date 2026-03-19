export default function LandingHighlights({ items }) {
  return (
    <ul className="portal-landing-highlights">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
