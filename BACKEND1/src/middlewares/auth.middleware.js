const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authorization token missing'
    });
  }

  // 2️⃣ Extract token
  const token = authHeader.split(' ')[1];

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user context (VERY IMPORTANT)
    req.user = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
      role: decoded.role
    };

    next(); // allow request to continue
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};
