const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Example API endpoint (if you host on a server platform)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from your birthday-wish app!' });
});

// SPA fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
