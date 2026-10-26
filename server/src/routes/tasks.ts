import { Router } from 'express';
import { db } from '../db/index.js';
import { z } from 'zod';

const router = Router();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.number().optional(),
  status_id: z.number().optional(),
  project_id: z.number().nullable().optional(),
  parent_id: z.number().nullable().optional(),
});

router.get('/', (req, res) => {
  const projectId = req.query.project_id;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (projectId) {
    query += ' AND project_id = ?';
    params.push(projectId);
  }
  
  query += ' ORDER BY position ASC, created_at DESC';
  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

router.post('/', (req, res) => {
  try {
    const data = taskSchema.parse(req.body);
    const info = db.prepare(`
      INSERT INTO tasks (title, description, due_date, priority, status_id, project_id, parent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.description || null,
      data.due_date || null,
      data.priority || 2,
      data.status_id || 1,
      data.project_id || null,
      data.parent_id || null
    );
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: 'Données invalides', details: err });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const keys = Object.keys(updates);
  
  if (keys.length === 0) return res.status(400).json({ error: 'Aucune donnée' });

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => updates[k]);

  try {
    db.prepare(`UPDATE tasks SET ${setClause}, updated_at = datetime('now') WHERE id = ?`).run(...values, id);
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Erreur', details: err });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

export default router;
