import { Router } from 'express';
import { db } from '../db/index.js';
import { z } from 'zod';

const router = Router();

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

// Lire tous les projets
router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects WHERE archived = 0 ORDER BY created_at DESC').all();
  res.json(projects);
});

// Créer un projet
router.post('/', (req, res) => {
  try {
    const data = projectSchema.parse(req.body);
    const info = db.prepare('INSERT INTO projects (name, description, color) VALUES (?, ?, ?)').run(
      data.name, data.description || null, data.color || '#3b82f6'
    );
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: 'Données invalides', details: err });
  }
});

export default router;
