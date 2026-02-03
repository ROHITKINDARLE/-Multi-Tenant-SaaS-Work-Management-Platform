const userService = require('./user.service');

/* ===============================
   GET ALL USERS IN ORGANIZATION
================================ */
exports.getUsers = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    console.log('getUsers called with org ID:', organizationId);
    
    const users = await userService.getUsersByOrganization(organizationId);
    console.log('getUsers returned:', users.length, 'users');

    res.json({ data: users });
  } catch (err) {
    console.error('Error in getUsers controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/* ===============================
   GET USER BY ID
================================ */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const organizationId = req.user.organizationId;
    
    const user = await userService.getUserById(userId, organizationId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    console.error('Error in getUserById controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

/* ===============================
   UPDATE USER ROLE
================================ */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const organizationId = req.user.organizationId;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const updatedUser = await userService.updateUserRole(userId, role, organizationId);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: updatedUser });
  } catch (err) {
    console.error('Error in updateUserRole controller:', err.message);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

/* ===============================
   DELETE USER
================================ */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const organizationId = req.user.organizationId;

    const deletedUser = await userService.deleteUser(userId, organizationId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error in deleteUser controller:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
