```markdown
# birthday-wish

Simple site (static files in /public) plus a small Express server (index.js) if you later host on a server.

If you only want static hosting (Netlify), Netlify will serve files from the `public` folder directly (no server needed).

To run locally:
1. npm install
2. npm start
3. Open http://localhost:8080

Netlify configuration (for static site):
- Build command: (leave blank)
- Publish directory: public

If you need the /api/hello route to work in production, deploy the Express app to a server provider (Render, Railway, etc.) and point the client to that API URL.
```
