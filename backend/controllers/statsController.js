const User = require('../models/User');
const Incident = require('../models/Incident');
const Shelter = require('../models/Shelter');

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeIncidents = await Incident.countDocuments({ status: { $ne: 'Resolved' } });
    const activeResponders = await User.countDocuments({ role: 'Responder', status: 'Active' });
    const activeShelters = await Shelter.countDocuments({ status: 'Open' });
    const totalVictims = await User.countDocuments({ role: 'Victim' });
    const totalVolunteers = await User.countDocuments({ role: 'Volunteer' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeIncidents,
        activeResponders,
        activeShelters,
        totalVictims,
        totalVolunteers
      }
    });
  } catch (error) {
    next(error);
  }
};
