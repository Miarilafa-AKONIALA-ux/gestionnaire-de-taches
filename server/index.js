import express from 'express';
import cors from 'cors';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/taches', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM taches ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur lors de la recuperation");
    }
});

app.post('/api/taches', async (req, res) => {
    try {
        const { texte } = req.body;
        const nouvelleTache = await pool.query(
            'INSERT INTO taches (texte) VALUES ($1) RETURNING *',
            [texte]
        );
        res.json(nouvelleTache.rows[0]); // On renvoie la tâche nouvellement créée
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur lors de l'ajout");
    }
});

app.put('/api/taches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { texte } = req.body;
        
        await pool.query(
            'UPDATE taches SET texte = $1 WHERE id = $2',
            [texte, id]
        );
        res.json({ message: "La tâche a bien été modifiée !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur lors de la modification");
    }
});

app.put('/api/taches/:id/check', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'UPDATE taches SET termine = NOT termine WHERE id = $1',
            [id]
        );
        res.json({ message: "Statut mis à jour !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur lors de la mise à jour du statut");
    }
});

app.delete('/api/taches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM taches WHERE id = $1', [id]);
        res.json({ message: "La tâche a été supprimée avec succès !" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur lors de la suppression");
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});