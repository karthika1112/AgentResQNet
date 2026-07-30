const ResourceCommandAgent = require('../agents/ResourceCommandAgent');
const ResourceInventory = require('../models/ResourceInventory');

exports.getGlobalInventory = async (req, res, next) => {
  try {
    const inventory = await ResourceInventory.find().populate('warehouse');
    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

exports.requestResources = async (req, res, next) => {
  try {
    const { lat, lon, requiredResources, incidentSeverity, victimCount } = req.body;
    
    if (!lat || !lon || !requiredResources) {
      return res.status(400).json({ success: false, message: 'lat, lon, and requiredResources are required' });
    }

    const rcoa = new ResourceCommandAgent();
    const result = await rcoa.execute({ 
      lat: parseFloat(lat), 
      lon: parseFloat(lon),
      requiredResources,
      incidentSeverity,
      victimCount
    });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const { warehouseId, updates } = req.body;
    
    if (!warehouseId || !updates) {
      return res.status(400).json({ success: false, message: 'warehouseId and updates are required' });
    }

    const inventory = await ResourceInventory.findOneAndUpdate(
      { warehouse: warehouseId },
      { $set: updates },
      { new: true, upsert: true }
    );

    // Emit live update
    const { getIO } = require('../config/socket');
    const io = getIO();
    io.emit('inventory:update', { warehouseId, inventory });

    res.status(200).json({
      success: true,
      message: 'Inventory manually updated',
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};
