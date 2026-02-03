const authService = require('./auth.service');

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      message: 'Signup successful',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: 'Login successful',
      token: result.token
    });
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};
