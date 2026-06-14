# Database Schema

## profiles

Stores one profile per Supabase Auth user.

- `id`: auth user id.
- `email`: user email, if available.
- `created_at`: profile creation time.

## cleanup_sessions

Stores each cleanup session.

- `id`: session id.
- `user_id`: profile owner.
- `started_at`: session start time.
- `completed_at`: optional completion time.

## media_decisions

Stores keep/delete decisions for local media assets.

- `id`: decision id.
- `session_id`: cleanup session id.
- `user_id`: profile owner.
- `device_asset_id`: local device asset identifier.
- `media_kind`: `photo` or `video`.
- `decision`: `keep` or `delete`.
- `created_at`: decision time.
