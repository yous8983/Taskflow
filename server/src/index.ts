import express from 'express';
import cors from 'cors';
import statusesRouter from './routes/statuses.js';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow API is running 🚀' });
});

app.use('/api/statuses', statusesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log('🚀 Serveur prêt sur http://localhost:' + PORT);
});
