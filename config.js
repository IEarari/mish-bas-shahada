/* إعدادات موقع حملة «مش بس شهادة»
   الورش وفرص التدريب صارت تُدار من لوحة التحكم (admin.html) وتنحفظ على Firebase.
   هذا الملف فيه فقط: إعدادات Firebase، أهداف الحملة، والورش الافتراضية اللي بتنضاف بكبسة زر أول مرة. */
window.MBS_CONFIG = {

  /* 1) إعدادات Firebase: من Firebase Console › Project settings › Your apps › Web app.
     طالما apiKey فارغ يعمل الموقع بوضع تجريبي ويحفظ على الجهاز نفسه فقط. */
  firebase: {
    apiKey: "AIzaSyDh4cG7uJFYT7VgWteVQykkaNc-IDovok8",
    authDomain: "mish-bas-shahada.firebaseapp.com",
    projectId: "mish-bas-shahada",
    storageBucket: "mish-bas-shahada.firebasestorage.app",
    messagingSenderId: "754545832959",
    appId: "1:754545832959:web:5d7d16114601a7147aadca"
  },

  /* 2) أهداف الحملة كما في البروبوزال، وتظهر في لوحة التحكم */
  targets: { tests: 150, registrations: 40 },

  /* 3) الورش الثلاث الافتراضية: لوحة التحكم بتعرض زر لإضافتها لقاعدة البيانات إذا كانت فاضية.
     skills: 0 اللغة، 1 الرقمية، 2 الخبرة، 3 التواصل، 4 الفريق، 5 السيرة */
  defaultWorkshops: [
    { name: "سيرتك بتحكي", skills: [5, 2], about: "السيرة الذاتية والمقابلة، وكيف تحكي تجربتك ولو كانت قصيرة.",
      output: "سيرة ذاتية محدّثة وتعريف مهني بدقيقة", date: "يُعلن قريباً", place: "نابلس", seats: 20, open: true, order: 1 },
    { name: "أدواتك الرقمية", skills: [1], about: "أداة رقمية أساسية مرتبطة بتخصصك، من الصفر لملف منجز.",
      output: "ملف أو عرض منجز خلال الورشة", date: "يُعلن قريباً", place: "نابلس", seats: 20, open: true, order: 2 },
    { name: "قدّم حالك", skills: [3, 0, 4], about: "التواصل والعرض بالعربية والإنجليزية، والعمل ضمن فريق.",
      output: "عرض قصير مسجّل أمام المجموعة", date: "يُعلن قريباً", place: "نابلس", seats: 20, open: true, order: 3 }
  ],

  /* 4) فرص توضيحية تظهر في الوضع التجريبي فقط (قبل ربط Firebase)، ولا تنضاف لقاعدة البيانات */
  demoOpportunities: [
    { title: "تدريب ميداني صيفي", org: "مؤسسة محلية في نابلس", kind: "تدريب", skill: 2, time: "6 أسابيع", link: "" },
    { title: "دورة محادثة بالإنجليزية للمبتدئين", org: "مركز لغات", kind: "دورة", skill: 0, time: "4 أسابيع", link: "" },
    { title: "أساسيات Excel للعمل المكتبي", org: "مركز تدريب مهني", kind: "دورة", skill: 1, time: "10 ساعات", link: "" },
    { title: "تطوع في تنظيم فعاليات مجتمعية", org: "جمعية شبابية", kind: "تطوع", skill: 4, time: "مرن", link: "" },
    { title: "مراجعة السيرة الذاتية مع مختص", org: "مكتب التوجيه المهني في الجامعة", kind: "استشارة", skill: 5, time: "جلسة واحدة", link: "" },
    { title: "نادي العرض والخطابة", org: "مبادرة طلابية", kind: "نشاط", skill: 3, time: "أسبوعي", link: "" }
  ]
};
