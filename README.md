# StudyBuddy

StudyBuddy is a full-stack learning platform for students, instructors, and
administrators. It includes authentication, course authoring, video lessons,
progress tracking, ratings, payments, profile management, and contact email.

## Tech stack

- React 18, Redux Toolkit, React Router, and Tailwind CSS
- Node.js, Express, MongoDB, and Mongoose
- Cloudinary for media, Razorpay for payments, and SMTP for email

## Local setup

Requirements: Node.js 18 or newer and MongoDB.

1. Install both dependency sets:

   ```sh
   npm ci
   npm ci --prefix server
   ```

2. Copy `.env.example` to `.env` and `server/.env.example` to `server/.env`.
   Replace every placeholder with the appropriate local or provider value.

3. Start the client and API together:

   ```sh
   npm run dev
   ```

The client runs at `http://localhost:3000`; the API defaults to
`http://localhost:4000/api/v1`.

## Commands

```sh
npm start             # frontend development server
npm run server        # backend development server
npm run dev           # frontend and backend together
npm run build         # optimized frontend build
npm start --prefix server
```

## Configuration notes

- Frontend variables must begin with `REACT_APP_`.
- `CLIENT_URL` controls the API CORS allow-list.
- `FRONTEND_URL` is used in password-reset links.
- Never commit either real `.env` file.

## Production

Run `npm run build`, serve the generated `build/` directory from a static host,
and deploy `server/` as a Node service. Configure all production environment
variables on the hosting providers and use HTTPS URLs for `CLIENT_URL`,
`FRONTEND_URL`, and `REACT_APP_BASE_URL`.
