const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nvd',
  password: 'postgres',
  port: 5432,
});
app.use(cors());
app.use(express.json());


app.get('/api/data', async (req, res) => {
  try {
    const subjectsResult = await pool.query('SELECT * FROM subjects;');
    const commentsResult = await pool.query('SELECT * FROM comments;');

    const data = {
      subjects: subjectsResult.rows,
      comments: commentsResult.rows,
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/popular', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/comments/:boardId', async (req, res) => {
  const { boardId } = req.params;
  try {
    // const client = await pool.connect();
    const result = await pool.query('SELECT * FROM comments WHERE board_id = $1', [boardId]);
    const comments = result.rows;
    // client.release();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching board comments:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/comments', async (req, res) => {
  const {commentText, parent_id, type, board_id, depth, commentUser } = req.body;

  try {
    await pool.query('INSERT INTO comments (comment_text, parent_id, type, board_id, depth, comment_user) VALUES ($1, $2, $3, $4, $5, $6)',  [ commentText, parent_id, type, board_id, depth+1, commentUser]);
    res.status(201).json({ message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM favorites ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const { id, name } = req.body;
  try {
    await pool.query('INSERT INTO favorites (id, name) VALUES ($1, $2)', [id, name]);
    res.status(201).json({ message: 'Subject added to favorites' });
  } catch (error) {
    console.error('Error adding subject to favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM favorites WHERE id = $1', [id]);
    res.json({ message: 'Subject removed from favorites' });
  } catch (error) {
    console.error('Error removing subject from favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM it_roles ORDER BY LENGTH(role_name) ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/roles', async (req, res) => {
  const { role_name } = req.body;
  try {
    const result = await pool.query('INSERT INTO it_roles (role_name) VALUES ($1) RETURNING id', [role_name]);
    const roleId = result.rows[0].id;
    res.status(201).json({ id: roleId, message: 'Role added successfully' });
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/roles_subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles_subjects ;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching roles_subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/roles_subjects', async (req, res) => {
  const { role_id, subject_ids, subject_names } = req.body;
  try {
    if (!role_id || !subject_ids || !subject_names || !Array.isArray(subject_ids) || !Array.isArray(subject_names)) {
      return res.status(400).json({ error: 'Invalid request. Role ID, subject IDs, and subject names are required.' });
    }

    for (let i = 0; i < subject_ids.length; i++) {
      await pool.query('INSERT INTO roles_subjects (role_id, subject_id, subject_name) VALUES ($1, $2, $3)', [role_id, subject_ids[i], subject_names[i]]);
    }
    res.status(201).json({ message: 'Subjects linked to role successfully' });
  } catch (error) {
    console.error('Error linking subjects to role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/roles_subjects/:roleId', async (req, res) => {
  const { roleId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM roles_subjects WHERE role_id = $1', [roleId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////////////////////////
app.post('/api/vote', async (req, res) => {
  const { role_id, subject_id, vote_change } = req.body;

  if (vote_change !== 1 && vote_change !== -1) {
    return res.status(400).json({ error: 'Invalid vote_change value' });
  }

  try {
    await pool.query(`
        UPDATE role_subject_votes
        SET votes = votes + $1
        WHERE role_id = $2 AND subject_id = $3`,
        [vote_change, role_id, subject_id]
  );

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error updating votes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/votes/:role_id/:subject_id', async (req, res) => {
  const { role_id, subject_id } = req.params;

  try {
    const result = await pool.query(`
        SELECT votes
        FROM role_subject_votes
        WHERE role_id = $1 AND subject_id = $2`,
        [role_id, subject_id]
  );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Vote record not found' });
    }
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
