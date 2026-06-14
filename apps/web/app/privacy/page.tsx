import { SiteNav } from '../../components/SiteNav';

export default function PrivacyPage() {
  return (
    <main>
      <SiteNav />
      <article className="legal">
        <h1>Privacy Policy</h1>
        <p>Last updated: June 13, 2026</p>
        <p>
          SwipeClean is being built to help users review their own photo and video libraries. The
          current prototype uses mock data and does not upload personal media.
        </p>
        <p>
          When Supabase and device media access are connected, this policy should be updated to
          describe authentication data, app activity, storage behavior, support requests, and user
          deletion rights.
        </p>
      </article>
    </main>
  );
}
