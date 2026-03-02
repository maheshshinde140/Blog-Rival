import Link from 'next/link';

const highlights = [
  { label: 'Writers onboarded', value: '2,000+' },
  { label: 'Stories published', value: '18k+' },
  { label: 'Avg. read time', value: '4.8 min' },
];

const benefits = [
  {
    title: 'Beautiful writing flow',
    text: 'Draft, edit, and publish from a clean editor with featured images and instant preview feedback.',
  },
  {
    title: 'Community-first feed',
    text: 'Your stories appear in a public feed where readers can like, comment, and keep engagement active.',
  },
  {
    title: 'Personal profile hub',
    text: 'Manage your public profile, avatar, bio, location, and website from your dashboard.',
  },
];

export default function HomePage() {
  return (
    <section className="page-shell landing">
      <div className="hero hero-landing">
        <span className="hero-badge">Blog Rival Platform</span>
        <h1>Turn ideas into stories people remember.</h1>
        <p>
          Build your profile, publish image-rich blogs, and grow through real reader engagement.
        </p>
        <div className="button-group">
          <Link href="/feed" className="btn btn-primary">Explore Feed</Link>
          <Link href="/auth/register" className="btn btn-secondary">Create Account</Link>
          <Link href="/auth/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>

      <div className="landing-stats">
        {highlights.map(item => (
          <article key={item.label} className="card stat-card">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>

      <div className="landing-grid">
        {benefits.map(item => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <p className="muted" style={{ marginTop: '0.6rem' }}>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
