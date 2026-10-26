import { Router } from 'express';
import { db } from '../db/index.js';

const router = Router();

router.get('/', (req, res) => {
  const statuses = db.prepare('SELECT * FROM statuses ORDER BY position ASC').all();
  res.json(statuses);
});

export default router;
