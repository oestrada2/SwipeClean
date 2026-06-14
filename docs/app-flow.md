# App Flow

1. User opens SwipeClean.
2. App requests Android media permissions.
3. App builds a review queue from local photos and videos.
4. User swipes right to keep or left to mark for deletion.
5. App saves decisions locally and later to Supabase.
6. User reviews the deletion queue.
7. User confirms deletion.
8. App shows storage cleaned and session summary.

The current prototype starts at step 3 with mock media data.
