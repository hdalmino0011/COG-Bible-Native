# COG (T.J.R) Bible

An offline-first Bible application with parallel Cebuano (Bugna) and English
(KJV) text. It is built as a Progressive Web App for phones and desktop
browsers.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run lint
npm run build
```

The production files are written to `dist/`.

## Publish with GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` again, or run **Deploy to GitHub Pages** from the
   repository's **Actions** tab.

The included workflow builds and deploys the app. The Vite configuration uses
relative paths so it works at a GitHub Pages project URL, not only at a
domain root.

## Mobile App Builds (Android APK & iOS IPA)

This repository includes automated GitHub Actions workflows that automatically build both Android and iOS applications whenever you push code or trigger them manually from the **Actions** tab:

### 1. Congregation Android APK (`build-apk.yml`)
- Automatically builds `cog-tjr-bible-offline-debug.apk`.
- Located under **Actions → Build Android APK (Gradle) → Artifacts**.
- 100% offline Bible reader, dictionary, quiz, and bookmarks.
- Online-enabled **Lessons** section for reading and downloading church sermons and study materials.

### 2. Pastor & Minister Lessons Upload APK (`build-pastor-apk.yml`)
- Dedicated standalone mobile app for pastors and ministers to upload study lessons, sermons, hymn sheets, and lecture files.
- Automatically builds `cog-pastor-lessons-upload-debug.apk` using Gradle in GitHub Actions.
- Located under **Actions → Build Pastor Lessons Upload APK (Gradle) → Artifacts**.
- Features file picker supporting PDF, PNG, JPG, DOCX, etc., upload progress, categorization, and file deletion/management.

### 3. iOS IPA (`build-ios.yml`)
- Automatically builds `cog-tjr-bible-offline.ipa` on a native macOS runner with Xcode.
- Located under **Actions → Build iOS IPA (Xcode) → Artifacts**.

---

## Supabase Setup for Church Lessons

The Bible application operates completely offline for all scripture reading, dictionary, search, and quiz. The only section requiring an internet connection is **Lessons**, where members can view and download sermon materials and study notes uploaded by ministers.

### 1. Create Storage Bucket
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and go to **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `lessons`
4. Set it to **Public Bucket** so that church members can view and download files.

### 2. Run SQL Schema
Go to **SQL Editor** in your Supabase project and execute:

```sql
-- Create lessons table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text default '',
  minister_name text not null,
  file_url text not null,
  file_name text not null,
  file_type text default 'pdf',
  file_size_bytes bigint default 0,
  category text default 'general',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.lessons enable row level security;

-- Congregation read policy
create policy "Public can view lessons" on public.lessons for select using (true);

-- Minister upload and delete policies
create policy "Allow insert lessons" on public.lessons for insert with check (true);
create policy "Allow delete lessons" on public.lessons for delete using (true);

-- Storage bucket access policies
create policy "Public storage view" on storage.objects for select using (bucket_id = 'lessons');
create policy "Allow storage upload" on storage.objects for insert with check (bucket_id = 'lessons');
create policy "Allow storage delete" on storage.objects for delete using (bucket_id = 'lessons');
```

### 3. Connect Credentials
1. Go to **Project Settings → API** in Supabase.
2. Copy your **Project URL** and **Anon Public Key**.
3. In the app's **Lessons** section or `.env`, enter your Project URL and Anon Key. The app will immediately connect and load published lessons!