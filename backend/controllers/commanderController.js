const CommanderAgent = require('../agents/CommanderAgent');
const ChatSession = require('../models/ChatSession');

exports.chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 1. Memory Management
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id });
    }
    
    if (!session) {
      session = await ChatSession.create({
        userId: req.user._id,
        messages: [{ role: 'user', content: message }]
      });
    } else {
      session.messages.push({ role: 'user', content: message });
      await session.save();
    }

    // 2. Process via Commander
    const commanderResponse = await CommanderAgent.processRequest(message, session.messages);

    // 3. Save Commander Response to memory
    session.messages.push({ role: 'commander', content: commanderResponse.response });
    await session.save();

    // 4. Return standard JSON
    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        ...commanderResponse
      }
    });

  } catch (error) {
    next(error);
  }
};
