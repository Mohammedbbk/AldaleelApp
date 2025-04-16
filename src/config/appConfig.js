import Constants from 'expo-constants';
import { I18n } from 'i18n-js';
import { translations as tripDetailsTranslations } from './translations';

// Environment variables
export const ENV = {
  OPENWEATHERMAP_API_KEY: Constants.expoConfig?.extra?.openWeatherMapApiKey || '',
};

// i18n translations
export const translations = {
  en: {
    trips: {
      list: {
        title: 'Created Trips',
        sortBy: 'Sort by',
        sortOptions: {
          date: 'date',
          destination: 'destination'
        },
        filters: {
          all: 'All',
          upcoming: 'Upcoming',
          planning: 'Planning',
          completed: 'Completed'
        },
        noTripsFound: 'No trips found',
        retry: 'Retry',
        createNew: 'Create New',
        errors: {
          fetchFailed: 'Failed to load trips. Please try again.'
        }
      },
      create: {
        title: 'New Trip',
        whereTo: 'Where to?',
        whenTo: 'When to?',
        searchPlaceholder: 'Search City or Destination',
        selectYear: 'Select Year',
        travelerStyle: 'Traveler Style',
        budgetLevel: 'Budget Level',
        noResults: 'No matching cities found',
        enterMore: 'Enter 2 or more characters to search',
        searching: 'Searching cities...',
        change: 'Change',
        requiredFields: 'Please select a destination and fill all other required fields',
        apiKeyMissing: 'API Key Missing',
        apiKeyMessage: 'Please configure your OpenWeatherMap API key',
        searchError: 'Could not fetch city data. Please try again later.',
      }
    },
    styles: {
      solo: 'Solo',
      family: 'Family',
      friends: 'Friends',
    },
    tripStyle: {
      title: 'Trip Style',
      stepIndicator: 'Step 2/3',
      interests: {
        title: 'Choose your interests',
        culture: 'Culture',
        nature: 'Nature',
        food: 'Food',
        shopping: 'Shopping',
        adventure: 'Adventure',
        relaxation: 'Relaxation'
      },
      pace: {
        title: 'Trip Pace',
        relaxed: 'Relaxed',
        balanced: 'Balanced',
        intense: 'Intense'
      },
      validation: {
        missingFields: 'Please select at least one interest and pace.'
      },
      buttons: {
        next: 'Next'
      }
    },
    budget: {
      economy: 'Economy',
      moderate: 'Moderate',
      luxury: 'Luxury',
    },
    tripDetails: tripDetailsTranslations.en.tripDetails,

  },
  ar: {
    trips: {
      list: {
        title: 'الرحلات المنشأة',
        sortBy: 'ترتيب حسب',
        sortOptions: {
          date: 'التاريخ',
          destination: 'الوجهة'
        },
        filters: {
          all: 'الكل',
          upcoming: 'القادمة',
          planning: 'التخطيط',
          completed: 'المكتملة'
        },
        noTripsFound: 'لم يتم العثور على رحلات',
        retry: 'إعادة المحاولة',
        createNew: 'إنشاء جديد',
        errors: {
          fetchFailed: 'فشل تحميل الرحلات. يرجى المحاولة مرة أخرى.'
        }
      },
      create: {
        title: 'رحلة جديدة',
        whereTo: 'إلى أين؟',
        whenTo: 'متى؟',
        searchPlaceholder: 'ابحث عن مدينة أو وجهة',
        selectYear: 'اختر السنة',
        travelerStyle: 'نمط السفر',
        budgetLevel: 'مستوى الميزانية',
        noResults: 'لم يتم العثور على مدن مطابقة',
        enterMore: 'أدخل حرفين أو أكثر للبحث',
        searching: 'جاري البحث عن المدن...',
        change: 'تغيير',
        requiredFields: 'الرجاء اختيار وجهة وملء جميع الحقول المطلوبة',
        apiKeyMissing: 'مفتاح API مفقود',
        apiKeyMessage: 'يرجى تكوين مفتاح OpenWeatherMap API الخاص بك',
        searchError: 'تعذر جلب بيانات المدينة. يرجى المحاولة مرة أخرى لاحقًا.',
      }
    },
    styles: {
      solo: 'منفرد',
      family: 'عائلة',
      friends: 'أصدقاء',
    },
    tripStyle: {
      title: 'نمط الرحلة',
      stepIndicator: 'الخطوة 2/3',
      interests: {
        title: 'اختر اهتماماتك',
        culture: 'الثقافة',
        nature: 'الطبيعة',
        food: 'الطعام',
        shopping: 'التسوق',
        adventure: 'المغامرة',
        relaxation: 'الاسترخاء'
      },
      pace: {
        title: 'وتيرة الرحلة',
        relaxed: 'مريحة',
        balanced: 'متوازنة',
        intense: 'مكثفة'
      },
      validation: {
        missingFields: 'الرجاء اختيار اهتمام واحد على الأقل ووتيرة الرحلة.'
      },
      buttons: {
        next: 'التالي'
      }
    },
    budget: {
      economy: 'اقتصادي',
      moderate: 'متوسط',
      luxury: 'فاخر',
    },
    tripDetails: tripDetailsTranslations.ar?.tripDetails || {},
  },
};

// Initialize i18n properly
const i18n = new I18n(translations); 
i18n.fallbacks = true;
i18n.locale = 'en';
i18n.defaultLocale = 'en';

export default i18n;