# Firebase Backend + Admin — Spark Plan (Free)

Everything runs on the **Spark (free) plan**. No Cloud Functions, no billing, no secrets.

Your project **web-dev-e1346** is linked (`.firebaserc`). Applications and contact messages are stored in Firestore; CVs are stored in Storage. Admin reads/updates data in Firestore after signing in.

---

## Done for you

- `.env` with your Firebase config and `VITE_ADMIN_EMAILS=ezzelfrancisco95@gmail.com`
- Project linked: `web-dev-e1346` (`.firebaserc`)
- **Firestore rules** updated for Spark (public create on applications/messages; admin read/update)
- App uses **Firestore + Storage only** (no Cloud Functions)

---

## 1) Enable Storage

- Open: https://console.firebase.google.com/project/web-dev-e1346/storage  
- Click **Get started** and complete setup  
- Then deploy Storage rules:

```powershell
cd D:\Lifewood-web\Lifewood-Web
npx firebase-tools deploy --only storage --project web-dev-e1346
```

---

## 2) Enable Authentication (Email/Password)

- Open: https://console.firebase.google.com/project/web-dev-e1346/authentication/providers  
- Click **Email/Password**, turn **Enable** on, then **Save**

---

## 3) Create admin list in Firestore

Firestore rules use a document to decide who can access the admin dashboard.

- Open: https://console.firebase.google.com/project/web-dev-e1346/firestore  
- Click **Start collection** (or **Add collection**)  
- **Collection ID:** `config`  
- **Document ID:** `admins`  
- Add a field:
  - **Field:** `emails`
  - **Type:** array  
  - **Value:** add one (or more) string items, e.g. `ezzelfrancisco95@gmail.com` (use lowercase)  
- Save

---

## 4) Deploy Firestore rules (after config/admins exists)

If you change rules or haven’t deployed yet:

```powershell
cd D:\Lifewood-web\Lifewood-Web
npx firebase-tools deploy --only firestore:rules --project web-dev-e1346
```

---

## 5) Create admin user (for /admin login)

- Open: https://console.firebase.google.com/project/web-dev-e1346/authentication/users  
- Click **Add user**  
- Email: same as in `config/admins` (e.g. `ezzelfrancisco95@gmail.com`)  
- Set a password and save

---

## 6) Run the app and test

```powershell
cd D:\Lifewood-web\Lifewood-Web
npm run dev
```

- **Apply:** open `/apply`, submit form + CV (saved to Firestore + Storage)  
- **Contact:** open `/contact`, send a message (saved to Firestore)  
- **Admin:** open `/admin`, sign in, then accept/reject applications (status updated in Firestore)

---

## Spark plan notes

- **No automatic email:** Contact form and accept/reject do **not** send email (that would require Cloud Functions + Gmail on Blaze). You can email applicants manually from the admin table (e.g. copy their email or use a “mailto” link).
- **No upgrade needed:** Everything above works on the free Spark plan.

---

## Quick reference

| Item            | Action                                      |
|-----------------|---------------------------------------------|
| `.env`          | Done                                       |
| `.firebaserc`   | Done (project `web-dev-e1346`)             |
| Firestore rules | Deploy after creating `config/admins` (step 4) |
| Storage         | Enable in Console, then deploy rules (step 1) |
| Auth            | Enable Email/Password (step 2)             |
| Admin list      | Create `config` → `admins` with `emails` array (step 3) |
| Admin user      | Create in Authentication (step 5)          |
