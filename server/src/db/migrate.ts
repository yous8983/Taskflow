import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../taskflow.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Exécution des migrations...');
const sqlFile = path.resolve(__dirname, '../migrations/001_init.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

try {
  db.exec(sql);
  console.log('✅ Base de données initialisée avec succès !');
} catch (error) {
  console.error('❌ Erreur lors de la migration:', error);
}
