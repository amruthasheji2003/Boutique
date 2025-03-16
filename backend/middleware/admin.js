exports.isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}; 