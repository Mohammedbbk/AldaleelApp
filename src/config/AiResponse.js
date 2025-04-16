// Example structure - Add actual content and images
// Make sure image paths are correct relative to where they are used,
// or use require() if they are local assets managed by Metro bundler.

// Example using require for local images in assets/Information_pictures/
const visaImage = require('../../assets/Information_pictures/Visa.png');
const localImage = require('../../assets/Information_pictures/Local.png');
const currencyImage = require('../../assets/Information_pictures/Currency.png');
const healthImage = require('../../assets/Information_pictures/Health.png');
const transportImage = require('../../assets/Information_pictures/Transportation.png');
const languageImage = require('../../assets/Information_pictures/Language.png');


export const AI_RESPONSE = {
  UserPlan: null, // Keep this for the AI plan

  updatePlan(aiData) {
    // ... (keep existing updatePlan implementation) ...
    const safeAiData = aiData && typeof aiData === 'object' ? aiData : {};
    const itineraryArray = Array.isArray(safeAiData.itinerary) ? safeAiData.itinerary : [];
    this.UserPlan = {
      details: [
        { name: 'Destination', value: safeAiData.destination || 'N/A' },
        { name: 'Duration', value: safeAiData.duration || 'N/A' },
        { name: 'Expenses', value: safeAiData.budget || 'N/A' }
      ],
      days: itineraryArray.map((day, index) => {
        const safeDay = day && typeof day === 'object' ? day : {};
        const activitiesArray = Array.isArray(safeDay.activities) ? safeDay.activities : [];
        return {
          day: index + 1,
          activities: [{
            time: safeDay.startTime || 'N/A',
            name: safeDay.title || 'N/A'
          }],
          plan: activitiesArray.map(activity => {
            const safeActivity = activity && typeof activity === 'object' ? activity : {};
            return {
              time: safeActivity.time || 'N/A',
              event: safeActivity.description || 'N/A'
            };
          })
        };
      })
    };
    console.log("Processed UserPlan in AI_RESPONSE:", JSON.stringify(this.UserPlan, null, 2));
    return this.UserPlan;
  },

  // --- ADD THE Information PROPERTY ---
  Information: {
    visa: {
      title: "Visa Requirements",
      image: visaImage, // Use imported image variable
      text: "Detailed visa information goes here... Requirements depend on your nationality and destination. Check official government websites..."
    },
    local: {
      title: "Local Customs & Etiquette",
      image: localImage,
      text: "Information about local customs, greetings, dress code, public behavior..."
    },
    currency: {
      title: "Currency & Payments",
      image: currencyImage,
      text: "Details about the local currency, exchange rates, typical costs, tipping culture, accepted payment methods (cash/card)..."
    },
    health: {
      title: "Health & Safety",
      image: healthImage,
      text: "Recommended vaccinations, common health risks, necessary precautions, travel insurance advice, emergency contact numbers..."
    },
    transportation: {
      title: "Local Transportation",
      image: transportImage,
      text: "Options for getting around: public transport (buses, trains), taxis, ride-sharing, car rentals, walking/cycling..."
    },
    language: {
      title: "Language Basics",
      image: languageImage,
      text: "Official language(s), common useful phrases (greetings, thanks, numbers), language apps, communication tips..."
    }
    // Add other content keys if needed
  }
};