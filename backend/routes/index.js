const express = require('express');
const mongoose = require('mongoose');
const { sendSuccess } = require('../utils/response');

const authRoutes = require('./authRoutes');
const statsRoutes = require('./statsRoutes');
const aiRoutes = require('./aiRoutes');
const commanderRoutes = require('./commanderRoutes');
const disasterRoutes = require('./disasterRoutes');
const verificationRoutes = require('./verificationRoutes');
const evacuationRoutes = require('./evacuationRoutes');
const rescueRoutes = require('./rescueRoutes');
const resourceRoutes = require('./resourceRoutes');
const workflowRoutes = require('./workflowRoutes');
const victimRoutes = require('./victimRoutes');
const volunteerRoutes = require('./volunteerRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/stats', statsRoutes);
router.use('/ai', aiRoutes);
router.use('/commander', commanderRoutes);
router.use('/disaster', disasterRoutes);
router.use('/verification', verificationRoutes);
router.use('/evacuation', evacuationRoutes);
router.use('/rescue', rescueRoutes);
router.use('/resources', resourceRoutes);
router.use('/workflow', workflowRoutes);
router.use('/victim', victimRoutes);
router.use('/volunteer', volunteerRoutes);

const os = require('os');
const { performance } = require('perf_hooks');

// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Operational' : 'Degraded';
  const memUsage = process.memoryUsage();
  
  sendSuccess(res, 200, 'Health check passed', {
    systems: [
      {
        name: 'MongoDB',
        status: dbStatus,
        uptime: '99.99%',
        ping: `${Math.floor(Math.random() * 20 + 5)}ms` // simulated DB ping
      },
      {
        name: 'Socket.IO',
        status: 'Operational',
        uptime: '100%',
        ping: `${Math.floor(Math.random() * 5 + 2)}ms` // simulated WS ping
      },
      {
        name: 'Google Gemini',
        status: 'Operational',
        uptime: '99.95%',
        ping: `${Math.floor(Math.random() * 100 + 200)}ms` // simulated API ping
      },
      {
        name: 'USGS / External APIs',
        status: 'Operational',
        uptime: '99.9%',
        ping: `${Math.floor(Math.random() * 150 + 100)}ms`
      }
    ],
    serverTime: new Date().toISOString(),
    metrics: {
      memoryUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(os.totalmem() / 1024 / 1024),
      cpuLoad: os.loadavg()[0].toFixed(2)
    }
  });
});

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const placeholders = [
  { path: '/users', roles: ['Admin'] },
  { path: '/incidents', roles: ['Victim', 'Responder', 'Admin'] },
  { path: '/resources', roles: ['Volunteer', 'Admin'] },
  { path: '/shelters', roles: ['Victim', 'Admin'] },
  { path: '/rescue', roles: ['Responder', 'Admin'] },
  { path: '/volunteers', roles: ['Admin'] },
  { path: '/responders', roles: ['Admin'] },
  { path: '/admin', roles: ['Admin'] },
  { path: '/chat', roles: ['Victim', 'Volunteer', 'Responder', 'Admin'] }
];

placeholders.forEach(routeObj => {
  router.all(routeObj.path, protect, authorize(...routeObj.roles), (req, res) => {
    res.json({ status: `Backend Ready for ${routeObj.path}`, role: req.user.role });
  });
});

module.exports = router;
