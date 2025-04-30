const express = require('express');
const router = express.Router();
const { z } = require('zod');

// Validation schemas
const AssistantRequestSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    userId: z.string(),
    tripId: z.string().optional(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }),
});

const AssistantResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  data: z.object({
    response: z.string(),
    metadata: z.object({
      timestamp: z.string(),
      model: z.string(),
      processingTime: z.number(),
    }),
  }).optional(),
  error: z.string().optional(),
});

// Middleware for request validation
const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.errors[0].message,
    });
  }
};

// Middleware for response validation
const validateResponse = (schema) => (req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    try {
      schema.parse(data);
      originalJson.call(this, data);
    } catch (error) {
      console.error('Response validation error:', error);
      originalJson.call(this, {
        status: 'error',
        error: 'Internal server error: Invalid response format',
      });
    }
  };
  next();
};

// Apply response validation middleware
router.use(validateResponse(AssistantResponseSchema));

// Assistant endpoint
router.post('/assistant', validateRequest(AssistantRequestSchema), async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Process the message and generate response
    const response = await processAssistantMessage(message, context);
    
    res.json({
      status: 'success',
      data: {
        response: response.text,
        metadata: {
          timestamp: new Date().toISOString(),
          model: 'gpt-4',
          processingTime: response.processingTime,
        },
      },
    });
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'Failed to process assistant request',
    });
  }
});

// Helper function to process assistant messages
async function processAssistantMessage(message, context) {
  const startTime = Date.now();
  
  // TODO: Implement actual AI processing logic
  const response = {
    text: `Echo: ${message}`,
    processingTime: Date.now() - startTime,
  };
  
  return response;
}

module.exports = router; 