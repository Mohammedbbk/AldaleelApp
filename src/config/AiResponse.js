// AiResponse.js - Central store for AI-generated travel plan data

export const AI_RESPONSE = {
  UserPlan: null, // Will be populated with the AI response

  // Method to update the plan with AI response
  updatePlan(aiData) {
    this.UserPlan = {
      details: [
        { name: 'Destination', value: aiData.destination },
        { name: 'Duration', value: aiData.duration },
        { name: 'Expenses', value: aiData.budget }
      ],
      days: aiData.itinerary.map((day, index) => ({
        day: index + 1,
        activities: [{
          time: day.startTime,
          name: day.title
        }],
        plan: day.activities.map(activity => ({
          time: activity.time,
          event: activity.description
        }))
      }))
    };
    return this.UserPlan;
  }
};