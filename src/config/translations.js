// src/config/translations.js

export const translations = {
  en: {
    tripDetails: {
      title: 'Trip Details',
      stepIndicator: 'Step 3/3',
      specialRequirements: {
        title: 'Special Requirements',
        halal: 'Halal Food Required',
        wheelchair: 'Wheelchair Accessible',
        kidFriendly: 'Kid-Friendly',
        petFriendly: 'Pet-Friendly',
        additionalPlaceholder: 'Enter more ...',
      },
      transportation: {
        title: 'Transportation Preference',
        publicTransport: 'Public Transport',
        privateCar: 'Private Car',
        walkingBiking: 'Walking/Biking',
        mixAll: 'Mix of all',
      },
      buttons: {
        createAdventure: 'Create Adventure',
        startFresh: 'Start Fresh ↗',
      },
      alerts: {
        success: {
          title: 'Trip Created',
          message: 'Your adventure has been created successfully! Check your itinerary for details.',
          ok: 'OK',
        },
        serverStarting: {
          title: 'Server Starting Up',
          message: 'Our server may be starting up after inactivity. Would you like to retry?',
          cancel: 'Cancel',
          retry: 'Retry',
        },
        error: {
          title: 'Error',
          message: 'Failed to create trip. Please try again later.',
        },
        startFresh: {
          title: 'Start Fresh',
          message: 'This will clear all trip data and take you back to step 1.',
          cancel: 'Cancel',
          ok: 'OK',
        },
      },
      loading: {
        visaRequirements: 'Fetching visa requirements...',
        travelRecommendations: 'Generating travel recommendations...\nThis may take a minute if the server is starting up.',
        events: 'Finding events near your destination...',
      },
    },
  },
};