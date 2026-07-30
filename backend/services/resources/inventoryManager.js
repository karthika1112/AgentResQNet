const ResourceInventory = require('../../models/ResourceInventory');
const { getIO } = require('../../config/socket');
const logger = require('../../utils/logger');

class InventoryManager {
  /**
   * Allocates resources from the specified warehouse.
   * Decrements stock in MongoDB and triggers Socket.IO event.
   * 
   * @param {ObjectId} warehouseId 
   * @param {Object} required { food: 50, water: 50, medicine: 10 }
   * @returns {Object} { success: boolean, allocated: Object, shortages: Object }
   */
  static async allocateResources(warehouseId, required) {
    try {
      let inventory = await ResourceInventory.findOne({ warehouse: warehouseId });
      
      if (!inventory) {
        return { success: false, message: 'No inventory record found for this warehouse', allocated: {}, shortages: required };
      }

      const allocated = {};
      const shortages = {};
      let success = true;

      // Check each required item
      for (const [item, amount] of Object.entries(required)) {
        if (inventory[item] !== undefined) {
          if (inventory[item] >= amount) {
            inventory[item] -= amount;
            allocated[item] = amount;
          } else {
            allocated[item] = inventory[item]; // Take whatever is left
            shortages[item] = amount - inventory[item];
            inventory[item] = 0;
            if (shortages[item] > 0) success = false;
          }
        } else {
          shortages[item] = amount;
          success = false;
        }
      }

      await inventory.save();

      // Emit Live Update
      const io = getIO();
      io.emit('inventory:update', {
        warehouseId: warehouseId,
        inventory: inventory
      });

      return {
        success, // true only if ALL requested items were fully allocated
        allocated,
        shortages
      };
    } catch (error) {
      logger.error('InventoryManager Error:', error);
      return { success: false, message: 'Internal Inventory Error', allocated: {}, shortages: required };
    }
  }
}

module.exports = InventoryManager;
