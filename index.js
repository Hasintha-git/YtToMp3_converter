const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ytdl = require('ytdl-core');
// const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000', 
  'https://yt-to-mp3-converter-70efoxzcx-hasinthas-projects.vercel.app'
];

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//   },
// });

// Enable CORS for HTTP requests
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(url, { format }).pipe(res);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Endpoint to stop the Socket.IO server
app.post('/stop-socket', (req, res) => {
  io.close(); // Close the Socket.IO server
  res.send('Socket server stopped');
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});