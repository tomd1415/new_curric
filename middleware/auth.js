const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to verify JWT
const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
const adminOnly = async (req, res, next) => {
  try {
    const user = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Middleware to check if user is subject leader for specific subject
const subjectLeaderOnly = async (req, res, next) => {
  try {
    const subjectId = parseInt(req.params.subjectId) || parseInt(req.body.subject_id);
    
    if (!subjectId) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }
    
    // Check if user is admin (admins can edit any subject)
    const user = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows[0].role === 'admin') {
      return next();
    }
    
    // Check if user is subject leader for this subject
    const isSubjectLeader = await db.query(
      'SELECT 1 FROM subject_leaders WHERE user_id = $1 AND subject_id = $2',
      [req.user.id, subjectId]
    );
    
    if (isSubjectLeader.rows.length === 0) {
      return res.status(403).json({ 
        message: 'Access denied. You are not the subject leader for this subject.' 
      });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { auth, adminOnly, subjectLeaderOnly };
