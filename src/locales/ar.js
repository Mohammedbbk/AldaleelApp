export default {
  trips: {
    list: {
      title: "الرحلات المنشأة",
      sortBy: "ترتيب حسب",
      sortOptions: {
        date: "التاريخ",
        destination: "الوجهة",
      },
      filters: {
        all: "الكل",
        upcoming: "القادمة",
        planning: "التخطيط",
        completed: "المكتملة",
      },
      noTripsFound: "لم يتم العثور على رحلات",
      retry: "إعادة المحاولة",
      createNew: "إنشاء جديد",
      errors: {
        fetchFailed: "فشل تحميل الرحلات. يرجى المحاولة مرة أخرى.",
      },
    },
    create: {
      title: "رحلة جديدة",
      whereTo: "إلى أين؟",
      whenTo: "متى؟",
      searchPlaceholder: "ابحث عن مدينة أو وجهة",
      selectYear: "اختر السنة",
      travelerStyle: "نمط السفر",
      budgetLevel: "مستوى الميزانية",
      noResults: "لم يتم العثور على مدن مطابقة",
      enterMore: "أدخل حرفين أو أكثر للبحث",
      searching: "جاري البحث عن المدن...",
      change: "تغيير",
      requiredFields: "الرجاء اختيار وجهة وملء جميع الحقول المطلوبة",
      apiKeyMissing: "مفتاح API مفقود",
      apiKeyMessage: "يرجى تكوين مفتاح OpenWeatherMap API الخاص بك",
      searchError: "تعذر جلب بيانات المدينة. يرجى المحاولة مرة أخرى لاحقًا.",
    },
  },
  styles: {
    solo: "منفرد",
    family: "عائلة",
    friends: "أصدقاء",
  },
  tripStyle: {
    title: "نمط الرحلة",
    stepIndicator: "الخطوة 2/3",
    interests: {
      title: "اختر اهتماماتك",
      culture: "الثقافة",
      nature: "الطبيعة",
      food: "الطعام",
      shopping: "التسوق",
      adventure: "المغامرة",
      relaxation: "الاسترخاء",
    },
    pace: {
      title: "وتيرة الرحلة",
      relaxed: "مريحة",
      balanced: "متوازنة",
      intense: "مكثفة",
    },
    validation: {
      missingFields: "الرجاء اختيار اهتمام واحد على الأقل ووتيرة الرحلة.",
    },
    buttons: {
      next: "التالي",
    },
  },
  budget: {
    economy: "اقتصادي",
    moderate: "متوسط",
    luxury: "فاخر",
  },
  // Replace this line
  tripDetails: {
    title: "تفاصيل الرحلة",
    stepIndicator: "الخطوة 3/3",
    specialRequirements: {
      title: "المتطلبات الخاصة",
      halal: "طعام حلال مطلوب",
      wheelchair: "تسهيلات لذوي الاحتياجات الخاصة",
      kidFriendly: "مناسب للأطفال",
      petFriendly: "مناسب للحيوانات الأليفة",
      additionalPlaceholder: "أدخل المزيد ...",
    },
    transportation: {
      title: "وسيلة النقل المفضلة",
      publicTransport: "النقل العام",
      privateCar: "سيارة خاصة",
      walkingBiking: "المشي/ركوب الدراجات",
      mixAll: "مزيج من الكل",
    },
    plan: {
      title: "خطتك",
      day: "اليوم {{number}}",
    },
    common: {
      next: "التالي",
      goBack: "العودة",
    },
    accessibility: {
      backButton: "العودة للخلف",
      homeButton: "الذهاب للرئيسية",
      shareButton: "مشاركة الخطة",
      editButton: "تعديل الخطة",
      nextButton: "الخطوة التالية",
    },
  },
};
