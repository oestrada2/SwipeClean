import { SiteNav } from '../components/SiteNav';

export default function HomePage() {
  return (
    <main className="page">
      <SiteNav />
      <section className="hero">
        <div>
          <div className="eyebrow">Android first photo cleanup</div>
          <h1>SwipeClean</h1>
          <p className="lede">
            Review photos and videos with fast left and right swipes, then clear clutter with
            confidence before anything is removed.
          </p>
          <div className="actions">
            <a className="button primary" href="mailto:hello@swipeclean.app">
              Join the waitlist
            </a>
            <a className="button" href="/privacy">
              Read privacy policy
            </a>
          </div>
        </div>

        <div className="phone" aria-label="SwipeClean app preview">
          <div className="phone-screen">
            <div className="sample-photo">
              <span>3.8 MB photo</span>
            </div>
            <div className="phone-actions">
              <div className="phone-action">Delete</div>
              <div className="phone-action">Keep</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sections">
        <article>
          <h2>Swipe fast</h2>
          <p>Make quick keep or delete decisions without digging through nested gallery menus.</p>
        </article>
        <article>
          <h2>Review first</h2>
          <p>Queue deletion choices for confirmation so cleanup stays intentional.</p>
        </article>
        <article>
          <h2>Cloud-ready</h2>
          <p>Supabase will power accounts, saved sessions, and app data as the product grows.</p>
        </article>
      </section>
    </main>
  );
}
