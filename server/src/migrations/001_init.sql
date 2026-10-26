PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password_hash TEXT, display_name TEXT NOT NULL DEFAULT 'Moi', created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE statuses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, color TEXT NOT NULL DEFAULT '#64748b', position INTEGER NOT NULL DEFAULT 0, is_final INTEGER NOT NULL DEFAULT 0, is_default INTEGER NOT NULL DEFAULT 0);
CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, color TEXT NOT NULL DEFAULT '#6366f1');
CREATE TABLE projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, color TEXT NOT NULL DEFAULT '#3b82f6', start_date TEXT, end_date TEXT, status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL, archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, due_date TEXT, priority INTEGER NOT NULL DEFAULT 2, status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL, project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL, parent_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE, position INTEGER NOT NULL DEFAULT 0, completed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE TABLE task_tags (task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE, tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY (task_id, tag_id));
CREATE TABLE checklists (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE, label TEXT NOT NULL, is_done INTEGER NOT NULL DEFAULT 0, position INTEGER NOT NULL DEFAULT 0);
CREATE TABLE templates (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL CHECK (type IN ('task', 'project')), name TEXT NOT NULL, description TEXT, payload TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE view_filters (id INTEGER PRIMARY KEY AUTOINCREMENT, view_name TEXT NOT NULL UNIQUE, filter_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')));
INSERT INTO users (display_name) VALUES ('Moi');
INSERT INTO statuses (name, color, position, is_final, is_default) VALUES
  ('À faire', '#94a3b8', 0, 0, 1), ('En cours', '#3b82f6', 1, 0, 0), ('En revue', '#f59e0b', 2, 0, 0),
  ('Terminé', '#10b981', 3, 1, 0), ('Bloqué', '#ef4444', 4, 0, 0), ('Annulé', '#6b7280', 5, 1, 0);
