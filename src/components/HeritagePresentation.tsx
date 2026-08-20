"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Info,
  Maximize2,
  Minimize2,
  Printer,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import {
  currentStreetGallery,
  financialScenarios,
  houseOfAntiquesUrl,
  projectFinancialData,
  projectMap,
  visionStreetGallery,
} from "@/data/projectConstants";

type MetricCard = {
  value: string;
  text: string;
};
type Slide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  imagePosition?: string;

  metrics?: MetricCard[];
  bullets?: string[];
  pillars?: { label: string; text: string }[];
  items?: string[];

  timeline?: {
    phase: string;
    focus: string;
    points: string[];
  }[];

  journey?: string[];
  placeholder?: string;

  credit?: {
    text: string;
    url: string;
  };

  map?: {
    title: string;
    subtitle: string;
    embedUrl: string;
    openUrl: string;
  };

  mapImage?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    showPropertyLegend?: boolean;
  };

  closing?: string;
  custom?:
    | "location"
    | "women"
    | "revenue"
    | "calculator"
    | "scalability"
    | "gallery"
    | "mapImage";
  galleryKind?: "current" | "vision";
  variant?:
    | "hero"
    | "opportunity"
    | "map"
    | "timeline"
    | "journey"
    | "dense"
    | "women"
    | "revenue"
    | "calculator"
    | "scalability"
    | "gallery"
    | "mapImage";
};

const slides: Slide[] = [
  {
    eyebrow: "01",
    title: "مشروع تأهيل واستثمار\nالشارع التراثي في أبو نؤاس",
    subtitle: "رؤية متكاملة للحفاظ العمراني والتنمية السياحية والاستثمارية",
    body: "بغداد — أبو نؤاس",
    image: "/images/project/street-panorama.jpg",
    imagePosition: "center center",
    variant: "hero",
  },

  {
    eyebrow: "موقع المشروع ومحاور الوصول",
    title: "موقع المشروع ومحاور الوصول",
    body: "خريطة توضيحية لموقع المشروع وعلاقته بمحاور الحركة والوصول المحيطة.",
    custom: "mapImage",
    mapImage: {
      src: "/images/location-on-map.jpg",
      width: 1920,
      height: 1080,
      alt: "موقع المشروع ومحاور الوصول",
    },
    variant: "gallery",
  },
  {
    eyebrow: "02 — الفرصة",
    title: "موقع استراتيجي وقيمة تراثية غير مستثمرة",
    body: "يربط الشارع بين أبو نؤاس والسعدون، ويقع بالقرب من الكورنيش الجديد ومجموعة من الفنادق، ما يمنحه مقومات حقيقية للتحول إلى وجهة تراثية وسياحية نشطة. إلا أن الإهمال البصري والخدمي يحجب حالياً قيمته العمرانية والاستثمارية.",
    image: "/images/project/street-location.jpg",
    imagePosition: "center center",
    metrics: [
      { value: "16", text: "بيتاً ضمن نطاق المشروع" },
      { value: "100–250 م²", text: "المساحة التقديرية للبيت الواحد" },
      { value: "موقع محوري", text: "يربط أبو نؤاس بالسعدون" },
      { value: "جذب سياحي قائم", text: "متحف بيت التحفيات" },
      { value: "فرصة استثمارية", text: "أصول تراثية قابلة لإعادة التوظيف" },
    ],
    variant: "opportunity",
  },
  {
    eyebrow: "03 — الموقع الاستراتيجي",
    title: "موقع استراتيجي بين أبو نؤاس والسعدون",
    subtitle: "موقع المشروع ضمن النسيج السياحي لوسط بغداد",
    body: "يقع المشروع ضمن محور رابط بين شارع أبو نؤاس وشارع السعدون، مقابل بوابة الدخول والخروج من الكورنيش الجديد، وعلى مقربة من مجموعة من الفنادق ونقاط الجذب السياحي القائمة، مما يمنحه قابلية حقيقية للتحول إلى وجهة تراثية وسياحية نشطة.",
    map: {
      title: "الموقع الاستراتيجي للمشروع",
      subtitle: "محور رابط بين شارع أبو نؤاس وشارع السعدون",
      embedUrl: projectMap.embedUrl,
      openUrl: projectMap.openUrl,
    },
    custom: "location",
    variant: "map",
  },
  {
    eyebrow: "04 — حالة الشارع الحالية",
    title: "حالة الشارع الحالية",
    body: "توثيق بصري لحالة الشارع والبيوت التراثية والتجاوزات والأسلاك والبنية الخدمية قبل بدء أعمال التأهيل.",
    custom: "gallery",
    galleryKind: "current",
    variant: "gallery",
  },

  {
    eyebrow: "العقارات والمساحات المستهدفة ضمن نطاق المشروع",
    title: "العقارات والمساحات المستهدفة ضمن نطاق المشروع",
    body: "خريطة توضيحية للعقارات والمساحات المستهدفة ضمن نطاق المشروع.",
    custom: "mapImage",
    mapImage: {
      src: "/images/sold-house-map.jpg",
      showPropertyLegend: true,
      width: 1920,
      height: 1080,
      alt: "العقارات والمساحات المستهدفة ضمن نطاق المشروع",
    },
    variant: "gallery",
  },
  {
    eyebrow: "05 — الرؤية المبدئية بعد التأهيل",
    title: "الرؤية المبدئية بعد التأهيل",
    body: "تصور أولي لإمكانات الشارع بعد معالجة التجاوزات والبنية التحتية وترميم الواجهات وإضافة الإنارة والتشجير والهوية الموحدة.",
    custom: "gallery",
    galleryKind: "vision",
    variant: "gallery",
  },
  {
    eyebrow: "06 — الواقع الحالي",
    title: "قيمة معمارية محاصرة بالفوضى البصرية",
    image: "/images/project/street-wires.jpg",
    bullets: [
      "أسلاك متشابكة ومكشوفة.",
      "تجاوزات تشوه الواجهات ومسار الحركة.",
      "أرصفة وتبليط غير متجانسين.",
      "واجهات بلا معالجة موحدة.",
      "ضعف الإنارة والتشجير.",
      "غياب الإرشاد السياحي والهوية المكانية.",
    ],
  },
  {
    eyebrow: "07 — الأصل القابل للبناء",
    title: "المشروع لا يبدأ من الصفر",
    body: "يمتلك الشارع مباني تراثية قائمة، وموقعاً متصلاً بمحاور الضيافة والسياحة، إضافة إلى وجود متحف بيت التحفيات داخل الشارع، وهو متحف ومتجر متخصص بالأنتيك والمقتنيات التراثية، ويستقطب منذ عقود السياح والفنانين والمهتمين بالفن والتراث.",
    image: "/images/project/house-of-antiques.jpg",
    imagePosition: "center center",
  },
  {
    eyebrow: "08 — الرؤية المقترحة",
    title: "من شارع مهمل إلى منطقة تراثية منتجة",
    image: "/images/project/heritage-houses.jpg",
    pillars: [
      { label: "الحفظ", text: "ترميم البيوت والعناصر المعمارية الأصلية." },
      { label: "التشغيل", text: "تحويل المباني إلى مشاريع ثقافية وسياحية وضيافة." },
      {
        label: "العائد",
        text: "خلق إيرادات مباشرة وغير مباشرة وفرص عمل ونشاط اقتصادي محلي.",
      },
    ],
  },
  {
    eyebrow: "09 — نطاق التأهيل الحضري",
    title: "تدخل حضري منظم قبل التشغيل التجاري",
    image: "/images/heritage-street/heritage-street-current-01.jpg",
    bullets: [
      "رفع التجاوزات وتنظيم الواجهات.",
      "معالجة ونقل شبكات الكهرباء والاتصالات بطريقة نظامية وآمنة.",
      "تنظيف الشارع وإدارة المخلفات.",
      "إعادة تبليط الشارع والأرصفة.",
      "ترميم وصبغ الواجهات وفق دليل موحد.",
      "إنارة معمارية، تشجير، أثاث حضري، ولوحات ثنائية اللغة.",
      "تنظيم حركة المركبات ومواقف الخدمة وأنظمة السلامة.",
    ],
    closing: "تنفذ أعمال الترميم بعد توثيق معماري وإنشائي متخصص.",
  },
  {
    eyebrow: "10 — إعادة توظيف البيوت الستة عشر",
    title: "مزيج أنشطة يصنع وجهة لا نسخة مكررة",
    image: "/images/heritage-street/heritage-museum-01.jpg",
    items: [
      "فندق بوتيك تراثي",
      "بيوت ضيافة بغدادية",
      "مطعم عراقي معاصر",
      "مقهى ثقافي",
      "معرض فنون",
      "متحف للذاكرة البغدادية",
      "مركز للحرف التقليدية",
      "متاجر أنتيك ومقتنيات",
      "استوديوهات ومراسم للفنانين",
      "مساحة عروض موسيقية وأمسيات",
      "مكتبة ومتجر كتب وصور تاريخية",
      "مركز تجارب طبخ عراقي",
      "بيت للأزياء والحرف العراقية",
      "مركز للزوار والمعلومات السياحية",
      "مساحة للمعارض المؤقتة",
      "حاضنة للصناعات الثقافية",
    ],
    closing:
      "التخصيص النهائي لكل عقار يعتمد على حالته الإنشائية ومساحته والجدوى الاستثمارية ومنع تكرار الأنشطة.",
    variant: "dense",
  },
  {
    eyebrow: "11 — تمكين المرأة",
    title: "المرأة شريك في تشغيل الاقتصاد التراثي",
    subtitle: "برنامج اقتصادي لدعم مشاركة المرأة في الصناعات الثقافية والإبداعية",
    body: "يخصص المشروع مساراً لتمكين المرأة اقتصادياً من خلال إشراك المشاريع النسائية والحرفيات والفنانات والمرشدات السياحيات في تشغيل الأنشطة الثقافية والتجارية، بالتعاون مع مؤسسات متخصصة أو جهة راعية، وبمؤشرات واضحة لفرص العمل والمبيعات واستدامة المشاريع.",
    custom: "women",
    variant: "women",
  },
  {
    eyebrow: "12 — نموذج الإيرادات",
    title: "كيف يحقق المشروع إيرادات مستدامة؟",
    subtitle:
      "تحويل الأصول التراثية من مبانٍ مهملة إلى منظومة سياحية واستثمارية منتجة",
    custom: "revenue",
    variant: "revenue",
  },
  {
    eyebrow: "13 — محاكاة مالية",
    title: "محاكاة الإيرادات والعائد المالي",
    subtitle:
      "أداة أولية لقياس السيناريوهات قبل استكمال التقييم العقاري ودراسة الجدوى التفصيلية",
    custom: "calculator",
    variant: "calculator",
  },
  {
    eyebrow: "14 — قابلية التوسع",
    title: "من مشروع تجريبي إلى منطقة تراثية متكاملة",
    body: "يمثل الشارع المرحلة الأولى لنموذج حضري واستثماري قابل للتوسع نحو الفروع المحيطة، التي تضم بدورها عدداً من البيوت التراثية والمباني المهملة. ويتيح نجاح المرحلة الأولى إنشاء شبكة مترابطة من المسارات الثقافية والسياحية بدلاً من الاكتفاء بتأهيل شارع منفرد.",
    custom: "scalability",
    variant: "scalability",
  },
  {
    eyebrow: "15 — نموذج التملك والاستثمار",
    title: "نموذج هجين يقلل كلفة البداية ويسرّع التشغيل",
    image: "/images/heritage-street/heritage-vision-01.jpg",
    pillars: [
      {
        label: "شراء أو استملاك",
        text: "للعقارات ذات الأولوية عندما تكون الجدوى واضحة.",
      },
      {
        label: "إيجار طويل الأمد",
        text: "مع التزام المستثمر بالترميم والتشغيل.",
      },
      {
        label: "شراكة إيرادات",
        text: "تقاسم العائد بين المالك والمشغل بحسب النشاط.",
      },
    ],
  },
  {
    eyebrow: "16 — العائد المالي",
    title: "مصادر إيراد متعددة دون أرقام افتراضية",
    image: "/images/heritage-street/heritage-vision-02.jpg",
    items: [
      "بدلات إيجار العقارات بعد الترميم",
      "رسوم الانتفاع والاستثمار",
      "نسبة من إيرادات بعض المشروعات",
      "تذاكر المتاحف والمعارض والتجارب",
      "رسوم الفعاليات والأسواق الموسمية",
      "الرعايات وحقوق تسمية الفعاليات",
      "مواقف السيارات وخدمات التنقل",
      "ترخيص التصوير والإنتاج الإعلامي",
      "متجر رقمي موحد وجولات سياحية مدفوعة",
      "ارتفاع القيمة الاقتصادية والنشاط السياحي",
    ],
    placeholder:
      "[تدرج كلفة التملك والترميم والتشغيل والإيرادات بعد استكمال التقييم المالي والعقاري]",
    variant: "dense",
  },
  {
    eyebrow: "17 — الخدمات الرقمية",
    title: "طبقة رقمية تحول الشارع إلى تجربة متصلة",
    image: "/images/heritage-street/heritage-details-01.jpg",
    bullets: [
      "موقع وتطبيق Web App للشارع مع خريطة تفاعلية.",
      "جولة افتراضية ثلاثية الأبعاد قبل وبعد الترميم.",
      "تذاكر وحجوزات موحدة للفعاليات والتجارب.",
      "رموز QR ودليل صوتي بالعربية والإنجليزية.",
      "واقع معزز، متجر إلكتروني، برنامج ولاء، وجواز رقمي.",
      "لوحة تحكم للزوار والحجوزات والإيرادات، مع أرشيف رقمي للمخططات والصور والوثائق.",
    ],
    closing:
      "الخدمات الرقمية وسيلة للتشغيل والقياس وتحقيق الإيرادات، وليست إضافات دعائية.",
  },
  {
    eyebrow: "18 — رحلة الزائر",
    title: "رحلة قصيرة وواضحة من الاكتشاف إلى العودة",
    image: "/images/project/abouthouse.jpg",
    journey: [
      "اكتشاف المشروع رقمياً",
      "الوصول من الكورنيش أو الفندق",
      "الدخول عبر بوابة الشارع",
      "استكشاف البيوت والأنشطة",
      "الحجز أو الشراء",
      "حضور فعالية أو تجربة",
      "مشاركة الزيارة والعودة مجدداً",
    ],
    variant: "journey",
  },
  {
    eyebrow: "19 — خطة التنفيذ",
    title: "برنامج تطوير مرحلي قابل للتكيّف مع نتائج التقييم",
    body: "تتحدد وتيرة التنفيذ وفق نتائج المسح الإنشائي والعقاري، وإجراءات التملك أو التعاقد، وأولويات الترميم، وجاهزية البنية التحتية، وطرح الفرص الاستثمارية.",
    timeline: [
      {
        phase: "01 — التوثيق والتقييم",
        focus: "قراءة دقيقة قبل التدخل",
        points: [
          "المسح العقاري والإنشائي.",
          "توثيق البيوت والعناصر المعمارية.",
          "تحديد الأولويات والمخاطر.",
        ],
      },
      {
        phase: "02 — معالجة البنية التحتية",
        focus: "تنظيم الشبكات والخدمات",
        points: [
          "إزالة التجاوزات الخطرة.",
          "معالجة الأسلاك والشبكات.",
          "تحسين التبليط والإنارة والتشجير.",
        ],
      },
      {
        phase: "03 — الترميم وإعادة التأهيل",
        focus: "حفظ القيمة العمرانية",
        points: [
          "ترميم العقارات ذات الأولوية.",
          "توحيد الواجهات والإرشاد.",
          "تجهيز المباني للاستخدام المناسب.",
        ],
      },
      {
        phase: "04 — الطرح والتشغيل الاستثماري",
        focus: "تحويل الأصول إلى نشاط",
        points: [
          "طرح فرص الاستثمار.",
          "تشغيل الأنشطة الأولى.",
          "قياس الطلب وتجربة الزائر.",
        ],
      },
      {
        phase: "05 — التوسع والتطوير المستمر",
        focus: "تحسين الأداء وتوسيع الأثر",
        points: [
          "توسيع الأنشطة الناجحة.",
          "ربط المشروع بالفنادق والسياحة.",
          "تحسين نموذج التشغيل وفق المؤشرات.",
        ],
      },
    ],
    variant: "timeline",
  },
  {
    eyebrow: "20 — البداية الذكية",
    title: "لا ننتظر اكتمال 16 بيتاً حتى يبدأ المشروع",
    image: "/images/heritage-street/heritage-street-current-03.jpg",
    bullets: [
      "مدخل الشارع من جهة أبو نؤاس.",
      "متحف بيت التحفيات كنقطة جذب قائمة.",
      "بيتان أو ثلاثة بيوت ذات أولوية.",
      "تنظيف وتنظيم وإنارة جزء واضح من الشارع.",
      "فعالية افتتاحية وجولة افتراضية توثق التحول.",
      "طرح أول الفرص الاستثمارية.",
    ],
    closing:
      "الهدف: نتيجة ملموسة وسريعة، اختبار التشغيل، وبناء ثقة المستثمرين قبل التوسع.",
  },
  {
    eyebrow: "21 — الحملة التسويقية",
    title: "الشارع التراثي في أبو نؤاس — بغداد التي تُعاش",
    subtitle: "بغداد تُفتح من بابها القديم",
    image: "/images/heritage-street/heritage-vision-03.jpg",
    pillars: [
      {
        label: "قبل الافتتاح",
        text: "قصص البيوت، قبل وبعد، يوميات الترميم، ولقاءات مع سكان وفنانين وحرفيين.",
      },
      {
        label: "الإطلاق",
        text: "أسبوع ثقافي وفني، سوق للحرف والأنتيك، جولات مرشدة، وتعاون مع الفنادق.",
      },
      {
        label: "بعد الافتتاح",
        text: "تقويم سنوي، ليالي متاحف، أسواق موسمية، باقات زيارة وحملات موجهة.",
      },
    ],
  },
  {
    eyebrow: "22 — مؤشرات النجاح",
    title: "مؤشرات قابلة للقياس منذ اليوم الأول",
    image: "/images/heritage-street/heritage-details-02.jpg",
    items: [
      "عدد البيوت المرممة",
      "نسبة الإشغال الاستثماري",
      "عدد الزوار",
      "متوسط إنفاق الزائر",
      "الإيرادات المباشرة",
      "عدد الفعاليات",
      "فرص العمل المستحدثة",
      "مشاركة المشاريع والحرف المحلية",
      "رضا الزوار",
      "مستوى الحفاظ على المباني",
      "الوصول الرقمي والحجوزات",
      "تكرار الزيارة",
    ],
    variant: "dense",
  },
  {
  eyebrow: "23 — الخاتمة",
  title: "إحياء الشارع استثمار في ذاكرة بغداد واقتصادها السياحي",
  body: "يمتلك الشارع التراثي في أبو نؤاس عناصر النجاح الأساسية: الموقع، العمارة، التاريخ، الفنادق، الكورنيش، ونقطة جذب قائمة. المطلوب هو جمع هذه العناصر ضمن مشروع واحد قابل للتنفيذ والقياس والاستثمار.",
  image: "/images/project/house-of-antiques.jpg",
  closing: "من 16 بيتاً… تبدأ وجهة جديدة لبغداد",
  credit: {
    text: "تم إعداد هذا العرض التقديمي بواسطة مكتب أبعاد العراق   للحلول البرمجية",

    url: "https://www.abaad-aliraq.com", 
  },
},

];

const cardGroupVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.11,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.64,
      ease: "easeOut",
    },
  },
};

const clampSlide = (index: number) =>
  Math.min(Math.max(index, 0), slides.length - 1);

function isSlideNavigationBlocked(target: EventTarget | null) {
  return target instanceof Element
    ? Boolean(
        target.closest(
          "iframe, .interactive-map, .financial-calculator, .revenue-table-wrap, .gallery-lightbox, .map-lightbox, input, textarea, select, a, [data-prevent-slide-navigation]",
        ),
      )
    : false;
}

function HouseOfAntiquesLink() {
  return (
    <a
      aria-label="زيارة الموقع الإلكتروني لمتحف بيت التحفيات"
      className="heritage-link"
      href={houseOfAntiquesUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      متحف بيت التحفيات
    </a>
  );
}

function renderLinkedText(text: string) {
  const linkedPhrase = "متحف بيت التحفيات";
  const parts = text.split(linkedPhrase);

  if (parts.length === 1) return text;

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <HouseOfAntiquesLink /> : null}
    </Fragment>
  ));
}

function LocationSlide({ slide }: { slide: Slide }) {
  const locationPoints = [
    {
      eyebrow: "01 — محور رابط",
      title: "محور رابط",
      text: "يربط شارع أبو نؤاس بشارع السعدون ويوفر اتصالاً مباشراً بين واجهة النهر ومركز المدينة.",
    },
    {
      eyebrow: "02 — بوابة الكورنيش",
      title: "بوابة الكورنيش",
      text: "يقع مدخل الشارع مقابل بوابة الدخول والخروج من مشروع الكورنيش الجديد.",
    },
    {
      eyebrow: "03 — محيط فندقي",
      title: "محيط فندقي",
      text: "يقع فندق عند ركن مدخل الشارع، إضافة إلى قربه من فندق بغداد وعدة فنادق عاملة وأخرى قيد الإنشاء.",
    },
    {
      eyebrow: "04 — نقطة جذب قائمة",
      title: "نقطة جذب قائمة",
      text: "يضم الشارع متحف بيت التحفيات، وهو متحف ومتجر أنتيك يستقطب السياح والفنانين والمهتمين بالفن والتراث منذ عقود.",
    },
    {
      eyebrow: "05 — قابلية الحركة سيراً",
      title: "قابلية الحركة سيراً",
      text: "يسمح موقع الشارع بوصول نزلاء الفنادق وزوار الكورنيش إليه سيراً دون الحاجة إلى مسار نقل منفصل.",
    },
    {
      eyebrow: "06 — فرصة للربط السياحي",
      title: "فرصة للربط السياحي",
      text: "يمكن دمج الشارع ضمن مسارات زيارة تربط الكورنيش والفنادق والمتحف والمشروعات الثقافية المستقبلية.",
    },
  ];

  if (!slide.map || !slide.body) return null;

  return (
    <div className="location-container">
      <header className="location-header">
        <p>{slide.eyebrow}</p>
        <span>{slide.subtitle}</span>
      </header>

      <div className="location-grid">
        <aside className="location-map-column" aria-label={slide.map.title}>
          <div
            className="interactive-map"
            data-prevent-slide-navigation="true"
            onPointerDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={slide.map.embedUrl}
              title="الموقع الاستراتيجي للمشروع"
            />
          </div>
          <a
            className="map-open-link location-map-link"
            href={slide.map.openUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            فتح الموقع على خرائط Google
          </a>
        </aside>

        <div className="location-content-column">
          <h1>{slide.title}</h1>
          <p className="location-body">{renderLinkedText(slide.body)}</p>
          <motion.div
            className="location-points"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={cardGroupVariants}
          >
            {locationPoints.map((point) => (
              <motion.article
                className="location-point"
                key={point.eyebrow}
                variants={cardVariants}
              >
                <b>{point.eyebrow}</b>
                <strong>{point.title}</strong>
                <p>{renderLinkedText(point.text)}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

type ScenarioKey = keyof typeof financialScenarios;
type FinancialInputs = (typeof financialScenarios)[ScenarioKey];
type ChartMode = "annual" | "scenarios" | "fiveYears";

const womenParticipation = [
  {
    title: "الحرف والصناعات الإبداعية",
    text: "دعم الحرفيات والمشاريع النسائية المتخصصة بالأزياء التراثية، التطريز، الفنون، التصميم، المنتجات اليدوية والمقتنيات الثقافية.",
  },
  {
    title: "الضيافة والطعام",
    text: "إتاحة فرص تشغيل واستثمار لمشاريع نسائية في الطعام العراقي، الضيافة، المقاهي الثقافية وتجارب الطبخ.",
  },
  {
    title: "الإرشاد والتجارب السياحية",
    text: "تدريب مرشدات سياحيات وإشراكهن في إدارة الجولات، التجارب الثقافية والفعاليات.",
  },
  {
    title: "التسويق والتجارة الرقمية",
    text: "تدريب المشاركات على إدارة المتاجر الإلكترونية، التصوير، التسويق الرقمي وبيع المنتجات داخل المنصة الموحدة للمشروع.",
  },
  {
    title: "الفنون والفعاليات",
    text: "إشراك الفنانات والمصممات وخريجات كليات الفنون في المعارض، الورش، التوثيق والبرامج الثقافية.",
  },
  {
    title: "فرص التشغيل والتوريد",
    text: "منح المشاريع النسائية المؤهلة فرصة عادلة للمشاركة في عقود التشغيل والتوريد والخدمات.",
  },
];

const womenIndicators = [
  "عدد المشاريع النسائية المشاركة.",
  "عدد فرص العمل المستحدثة.",
  "قيمة المبيعات المحققة.",
  "عدد المستفيدات من التدريب.",
  "نسبة استمرارية المشاريع.",
  "قيمة عقود التشغيل والتوريد.",
];

const revenueDirect = [
  "إيجارات البيوت والمرافق بعد التأهيل.",
  "رسوم الانتفاع والاستثمار.",
  "نسبة مشاركة من إيرادات بعض المشروعات.",
  "تذاكر المتاحف والمعارض والتجارب.",
  "رسوم الجولات السياحية.",
  "رسوم الفعاليات والأسواق الموسمية.",
  "الرعايات التجارية والثقافية.",
  "تراخيص التصوير والإنتاج الإعلامي.",
  "إيرادات المتجر الإلكتروني الموحد.",
  "خدمات مواقف السيارات والنقل عند اعتمادها.",
];

const revenueIndirect = [
  "رفع القيمة الاقتصادية للعقارات المحيطة.",
  "زيادة إنفاق السياح ونزلاء الفنادق في المنطقة.",
  "تنشيط المطاعم والمتاجر والخدمات المجاورة.",
  "خلق فرص عمل مباشرة وغير مباشرة.",
  "جذب استثمارات جديدة إلى المنطقة.",
  "زيادة مدة بقاء الزائر داخل مركز بغداد.",
  "دعم الصناعات الثقافية والحرفية المحلية.",
];

const financialControls: Array<{
  key: keyof FinancialInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  tooltip: string;
}> = [
  {
    key: "housesInPhase",
    label: "عدد البيوت الداخلة في المرحلة",
    unit: "بيت",
    min: 1,
    max: projectFinancialData.housesCount,
    step: 1,
    tooltip: "عدد البيوت التي تدخل ضمن كلفة الشراء والترميم في السيناريو.",
  },
  {
    key: "averageHouseArea",
    label: "متوسط مساحة البيت",
    unit: "م²",
    min: projectFinancialData.houseArea.min,
    max: projectFinancialData.houseArea.max,
    step: 5,
    tooltip: "متوسط افتراضي بين 100 و250 م² إلى حين تثبيت مساحة كل بيت.",
  },
  {
    key: "purchasePricePerSqm",
    label: "سعر شراء المتر",
    unit: "دولار/م²",
    min: projectFinancialData.purchasePricePerSqm.min,
    max: projectFinancialData.purchasePricePerSqm.max,
    step: 50,
    tooltip: "سعر تقديري للمتر لأغراض المحاكاة فقط، وليس تقييماً عقارياً.",
  },
  {
    key: "restorationCostPerSqm",
    label: "كلفة الترميم لكل متر مربع",
    unit: "دولار/م²",
    min: 250,
    max: 1800,
    step: 50,
    tooltip: "كلفة افتراضية تشمل أعمال التأهيل المعماري والخدمات الأساسية.",
  },
  {
    key: "investedHouses",
    label: "عدد البيوت المطروحة للاستثمار",
    unit: "بيت",
    min: 1,
    max: projectFinancialData.housesCount,
    step: 1,
    tooltip: "عدد البيوت التي تحقق إيراد إيجار ضمن السيناريو الحالي.",
  },
  {
    key: "monthlyRentPerSqm",
    label: "متوسط الإيجار الشهري لكل متر مربع",
    unit: "دولار/م²",
    min: 1,
    max: 35,
    step: 1,
    tooltip: "متوسط افتراضي لبدل الإيجار الشهري بعد التأهيل والتشغيل.",
  },
  {
    key: "occupancyRate",
    label: "نسبة الإشغال",
    unit: "%",
    min: 10,
    max: 100,
    step: 5,
    tooltip: "النسبة السنوية المتوقعة لاستثمار المساحات المطروحة.",
  },
  {
    key: "annualVisitors",
    label: "عدد الزوار السنوي",
    unit: "زائر",
    min: 0,
    max: 120000,
    step: 1000,
    tooltip: "عدد الزوار المدفوعين للتذاكر أو الجولات خلال سنة.",
  },
  {
    key: "ticketPrice",
    label: "متوسط سعر التذكرة أو الجولة",
    unit: "دولار",
    min: 0,
    max: 20,
    step: 0.5,
    tooltip: "متوسط سعر الدخول أو الجولة الثقافية.",
  },
  {
    key: "annualEvents",
    label: "عدد الفعاليات السنوي",
    unit: "فعالية",
    min: 0,
    max: 80,
    step: 1,
    tooltip: "الفعاليات والأسواق الموسمية والورش المدرة للإيراد.",
  },
  {
    key: "eventRevenue",
    label: "متوسط إيراد الفعالية",
    unit: "دولار",
    min: 0,
    max: 10000,
    step: 250,
    tooltip: "متوسط الإيراد المباشر لكل فعالية.",
  },
  {
    key: "sponsorshipRevenue",
    label: "إيرادات الرعاية السنوية",
    unit: "دولار",
    min: 0,
    max: 300000,
    step: 5000,
    tooltip: "رعايات ثقافية وتجارية محتملة قابلة للتعديل.",
  },
  {
    key: "mediaLicensingRevenue",
    label: "إيرادات التصوير والتراخيص",
    unit: "دولار",
    min: 0,
    max: 120000,
    step: 2500,
    tooltip: "تصوير وإنتاج إعلامي وحقوق استخدام مرتبطة بالموقع.",
  },
  {
    key: "digitalRevenue",
    label: "الإيرادات الرقمية والمتجر الإلكتروني",
    unit: "دولار",
    min: 0,
    max: 180000,
    step: 5000,
    tooltip: "بيع رقمي، حجوزات، متجر موحد، وتجارب إلكترونية.",
  },
  {
    key: "investorSalesRevenue",
    label: "مبيعات المستثمرين الخاضعة للمشاركة",
    unit: "دولار",
    min: 0,
    max: 1000000,
    step: 10000,
    tooltip: "إجمالي مبيعات مشروعات مختارة تحسب عليها نسبة مشاركة المشروع.",
  },
  {
    key: "investorSalesShare",
    label: "نسبة مشاركة المشروع من مبيعات المستثمرين",
    unit: "%",
    min: 0,
    max: 20,
    step: 1,
    tooltip: "نسبة افتراضية من مبيعات بعض المشروعات عند اعتمادها تعاقدياً.",
  },
  {
    key: "annualOperatingCost",
    label: "كلفة التشغيل السنوية",
    unit: "دولار",
    min: 0,
    max: 900000,
    step: 10000,
    tooltip: "إدارة وتشغيل وصيانة وتسويق وخدمات سنوية.",
  },
  {
    key: "setupCost",
    label: "أي كلفة تأسيس مضافة",
    unit: "دولار",
    min: 0,
    max: 800000,
    step: 10000,
    tooltip: "تجهيزات تأسيسية أو أنظمة أو مصاريف إطلاق غير داخلة في الشراء والترميم.",
  },
  {
    key: "annualGrowthRate",
    label: "معدل النمو السنوي",
    unit: "%",
    min: 0,
    max: 20,
    step: 0.5,
    tooltip: "يستخدم فقط في توقع خمس سنوات، ولا توجد نسبة نمو مخفية داخل الكود.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const formatCurrency = (value: number) =>
  `${currencyFormatter.format(Math.round(value))} دولار`;

function calculateFinancials(values: FinancialInputs) {
  const propertyValue =
    values.housesInPhase * values.averageHouseArea * values.purchasePricePerSqm;
  const restorationCost =
    values.housesInPhase * values.averageHouseArea * values.restorationCostPerSqm;
  const rentRevenue =
    values.investedHouses *
    values.averageHouseArea *
    values.monthlyRentPerSqm *
    12 *
    (values.occupancyRate / 100);
  const ticketRevenue = values.annualVisitors * values.ticketPrice;
  const eventRevenue = values.annualEvents * values.eventRevenue;
  const investorShareRevenue =
    values.investorSalesRevenue * (values.investorSalesShare / 100);
  const annualRevenue =
    rentRevenue +
    ticketRevenue +
    eventRevenue +
    values.sponsorshipRevenue +
    values.mediaLicensingRevenue +
    values.digitalRevenue +
    investorShareRevenue;
  const operatingNet = annualRevenue - values.annualOperatingCost;
  const initialInvestment = propertyValue + restorationCost + values.setupCost;
  const paybackYears =
    operatingNet > 0 && initialInvestment > 0
      ? initialInvestment / operatingNet
      : null;
  const operatingReturn =
    initialInvestment > 0 ? (operatingNet / initialInvestment) * 100 : 0;

  return {
    propertyValue,
    restorationCost,
    rentRevenue,
    ticketRevenue,
    eventRevenue,
    sponsorshipRevenue: values.sponsorshipRevenue,
    mediaLicensingRevenue: values.mediaLicensingRevenue,
    digitalRevenue: values.digitalRevenue,
    investorShareRevenue,
    annualRevenue,
    operatingCost: values.annualOperatingCost,
    operatingNet,
    initialInvestment,
    paybackYears,
    operatingReturn,
  };
}

function WomenEmpowermentSlide() {
  return (
    <div className="custom-flow women-flow">
      <motion.div
        className="women-card-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
        variants={cardGroupVariants}
      >
        {womenParticipation.map((item, index) => (
          <motion.article key={item.title} variants={cardVariants}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </motion.article>
        ))}
      </motion.div>

      <div className="women-bottom-grid">
        <motion.article
          className="sponsor-card"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.76, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <span>فرصة للشراكة والرعاية</span>
          <p>
            يمكن لجهة راعية أو مؤسسة متخصصة في تمكين المرأة دعم التدريب
            والتجهيز وبرامج تطوير المشاريع، مقابل الظهور كشريك للبرنامج وقياس
            أثر الرعاية بصورة واضحة.
          </p>
        </motion.article>

        <div className="indicator-panel">
          <div className="placeholder-counters" aria-label="عدادات Placeholder">
            {["عدد المشاريع", "فرص العمل", "المبيعات", "المستفيدات"].map(
              (label) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.72, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <b>[{label}]</b>
                  <small>قيمة Placeholder</small>
                </motion.span>
              ),
            )}
          </div>
          <ul>
            {womenIndicators.map((indicator) => (
              <li key={indicator}>{indicator}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RevenueModelSlide() {
  return (
    <div className="custom-flow revenue-flow">
      <div className="revenue-columns">
        <article>
          <h2>الإيرادات المباشرة</h2>
          <ul>
            {revenueDirect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>العائد الاقتصادي غير المباشر</h2>
          <ul>
            {revenueIndirect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="revenue-path" aria-label="مسار تحقيق الإيرادات">
        {[
          "أصول تراثية",
          "تأهيل وتشغيل",
          "نشاط سياحي وتجاري",
          "إيرادات مباشرة",
          "إعادة استثمار وتوسع",
        ].map((step, index) => (
          <Fragment key={step}>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: index * 0.06, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {step}
            </motion.span>
            {index < 4 ? <i aria-hidden="true">←</i> : null}
          </Fragment>
        ))}
      </div>
      <p className="revenue-note">
        لا يعتمد المشروع على مصدر دخل واحد، بل يجمع بين الإيجار والتشغيل
        والتذاكر والفعاليات والرعاية والخدمات الرقمية.
      </p>
    </div>
  );
}

function FinancialBarChart({
  mode,
  values,
  results,
}: {
  mode: ChartMode;
  values: FinancialInputs;
  results: ReturnType<typeof calculateFinancials>;
}) {
  const annualBars = [
    ["إيجارات", results.rentRevenue, "var(--gold)"],
    ["تذاكر", results.ticketRevenue, "var(--paper)"],
    ["فعاليات", results.eventRevenue, "#8ea5b3"],
    ["رعايات", results.sponsorshipRevenue, "#c9a66b"],
    ["تراخيص", results.mediaLicensingRevenue, "#9b8063"],
    ["رقمي", results.digitalRevenue, "#6f8a99"],
    ["الصافي", Math.max(results.operatingNet, 0), "#d8cdb8"],
  ] as const;

  const scenarioBars = (Object.keys(financialScenarios) as ScenarioKey[]).map(
    (key) => {
      const scenario = financialScenarios[key];
      const scenarioResults = calculateFinancials(scenario);
      return [
        scenario.label.replace("سيناريو ", ""),
        scenarioResults.annualRevenue,
        scenarioResults.operatingNet,
      ] as const;
    },
  );

  const growth = values.annualGrowthRate / 100;
  const fiveYearBars = Array.from({ length: 5 }, (_, index) => {
    const factor = (1 + growth) ** index;
    return [
      `السنة ${index + 1}`,
      results.annualRevenue * factor,
      results.operatingNet * factor,
    ] as const;
  });

  if (mode === "scenarios") {
    const max = Math.max(...scenarioBars.flatMap((bar) => [bar[1], bar[2]]), 1);
    return (
      <div className="chart-bars scenario-bars">
        {scenarioBars.map(([label, revenue, net]) => (
          <div className="chart-group" key={label}>
            <span title={`إجمالي الإيرادات: ${formatCurrency(revenue)}`}>
              <i
                style={{ height: `${Math.max(8, (revenue / max) * 100)}%` }}
              />
            </span>
            <span title={`صافي الإيراد: ${formatCurrency(net)}`}>
              <i
                style={{
                  height: `${Math.max(8, (Math.max(net, 0) / max) * 100)}%`,
                }}
              />
            </span>
            <b>{label}</b>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "fiveYears") {
    const max = Math.max(...fiveYearBars.flatMap((bar) => [bar[1], bar[2]]), 1);
    return (
      <div className="chart-bars scenario-bars">
        {fiveYearBars.map(([label, revenue, net]) => (
          <div className="chart-group" key={label}>
            <span title={`الإيراد: ${formatCurrency(revenue)}`}>
              <i
                style={{ height: `${Math.max(8, (revenue / max) * 100)}%` }}
              />
            </span>
            <span title={`الصافي: ${formatCurrency(net)}`}>
              <i
                style={{
                  height: `${Math.max(8, (Math.max(net, 0) / max) * 100)}%`,
                }}
              />
            </span>
            <b>{label}</b>
          </div>
        ))}
      </div>
    );
  }

  const max = Math.max(...annualBars.map((bar) => bar[1]), 1);

  return (
    <div className="chart-bars">
      {annualBars.map(([label, value, color]) => (
        <div className="chart-group" key={label}>
          <span title={`${label}: ${formatCurrency(value)}`}>
            <i
              style={{
                height: `${Math.max(8, (value / max) * 100)}%`,
                background: color,
              }}
            />
          </span>
          <b>{label}</b>
        </div>
      ))}
    </div>
  );
}

function FinancialCalculatorSlide() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("balanced");
  const [values, setValues] = useState<FinancialInputs>(financialScenarios.balanced);
  const [chartMode, setChartMode] = useState<ChartMode>("annual");

  const results = useMemo(() => calculateFinancials(values), [values]);
  const fiveYearFactor = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => (1 + values.annualGrowthRate / 100) ** index).reduce(
        (sum, factor) => sum + factor,
        0,
      ),
    [values.annualGrowthRate],
  );

  const revenueRows = [
    ["إيجارات البيوت", results.rentRevenue],
    ["التذاكر والجولات", results.ticketRevenue],
    ["الفعاليات", results.eventRevenue],
    ["الرعايات", results.sponsorshipRevenue],
    ["التصوير والتراخيص", results.mediaLicensingRevenue],
    ["الإيرادات الرقمية", results.digitalRevenue],
    ["الإجمالي", results.annualRevenue],
  ] as const;

  const resultCards = [
    ["القيمة العقارية التقديرية", formatCurrency(results.propertyValue)],
    ["كلفة الترميم التقديرية", formatCurrency(results.restorationCost)],
    ["إجمالي الاستثمار الأولي", formatCurrency(results.initialInvestment)],
    ["إيرادات الإيجارات السنوية", formatCurrency(results.rentRevenue)],
    [
      "إيرادات الزوار والفعاليات",
      formatCurrency(results.ticketRevenue + results.eventRevenue),
    ],
    ["إجمالي الإيرادات السنوية", formatCurrency(results.annualRevenue)],
    ["كلفة التشغيل السنوية", formatCurrency(results.operatingCost)],
    ["صافي الإيراد التشغيلي", formatCurrency(results.operatingNet)],
    [
      "فترة الاسترداد التقريبية",
      results.paybackYears
        ? `${percentFormatter.format(results.paybackYears)} سنة`
        : "غير متاح ضمن السيناريو الحالي",
    ],
    [
      "العائد التشغيلي السنوي",
      `${percentFormatter.format(results.operatingReturn)}%`,
    ],
  ];

  const updateValue = (key: keyof FinancialInputs, nextValue: number) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyScenario = (key: ScenarioKey) => {
    setScenarioKey(key);
    setValues(financialScenarios[key]);
  };

  return (
    <div className="financial-calculator">
      <div className="financial-alert">
        الأرقام الواردة أدناه افتراضات أولية لأغراض المحاكاة، ولا تمثل تقييماً
        عقارياً أو دراسة جدوى نهائية.
      </div>

      <div className="scenario-tabs" role="tablist" aria-label="سيناريوهات المحاكاة">
        {(Object.keys(financialScenarios) as ScenarioKey[]).map((key) => (
          <button
            aria-selected={scenarioKey === key}
            className={scenarioKey === key ? "is-active" : ""}
            key={key}
            onClick={() => applyScenario(key)}
            role="tab"
            type="button"
          >
            {financialScenarios[key].label}
          </button>
        ))}
      </div>

      <div className="calculator-layout">
        <section className="calculator-inputs" aria-label="مدخلات المحاكاة">
          {financialControls.map((control) => (
            <label className="finance-control" key={control.key}>
              <span>
                {control.label}
                <i title={control.tooltip}>
                  <Info size={14} />
                </i>
              </span>
              <div>
                <input
                  aria-label={control.label}
                  max={control.max}
                  min={control.min}
                  onChange={(event) =>
                    updateValue(control.key, Number(event.target.value))
                  }
                  step={control.step}
                  type="range"
                  value={values[control.key]}
                />
                <input
                  aria-label={`${control.label} كتابة يدوية`}
                  max={control.max}
                  min={control.min}
                  onChange={(event) =>
                    updateValue(control.key, Number(event.target.value))
                  }
                  step={control.step}
                  type="number"
                  value={values[control.key]}
                />
                <b>{control.unit}</b>
              </div>
            </label>
          ))}
        </section>

        <section className="calculator-output" aria-label="مخرجات المحاكاة">
          <div className="property-range">
            <strong>نطاق القيمة العقارية الأولية</strong>
            <span>الحد الأدنى النظري: 16 × 100 م² × 2,000 دولار = 3,200,000 دولار</span>
            <span>الحد الأعلى النظري: 16 × 250 م² × 2,500 دولار = 10,000,000 دولار</span>
            <p>
              هذا النطاق لا يمثل كلفة شراء نهائية، لأن المساحة والحالة الإنشائية
              والقيمة السوقية لكل بيت تحتاج إلى تقييم منفصل.
            </p>
          </div>

          <div className="result-grid">
            {resultCards.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <div className="chart-panel">
            <div className="chart-toolbar">
              <div>
                <button
                  className={chartMode === "annual" ? "is-active" : ""}
                  onClick={() => setChartMode("annual")}
                  type="button"
                >
                  توزيع الإيرادات السنوية
                </button>
                <button
                  className={chartMode === "scenarios" ? "is-active" : ""}
                  onClick={() => setChartMode("scenarios")}
                  type="button"
                >
                  مقارنة السيناريوهات
                </button>
                <button
                  className={chartMode === "fiveYears" ? "is-active" : ""}
                  onClick={() => setChartMode("fiveYears")}
                  type="button"
                >
                  توقع خمس سنوات
                </button>
              </div>
              <button onClick={() => window.print()} type="button">
                <Printer size={16} />
                طباعة النتائج
              </button>
            </div>
            <FinancialBarChart mode={chartMode} results={results} values={values} />
          </div>

          <div className="revenue-table-wrap">
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>مصدر الإيراد</th>
                  <th>سنوي</th>
                  <th>خمس سنوات</th>
                  <th>النسبة من الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {revenueRows.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{formatCurrency(value)}</td>
                    <td>{formatCurrency(value * fiveYearFactor)}</td>
                    <td>
                      {results.annualRevenue > 0
                        ? `${percentFormatter.format((value / results.annualRevenue) * 100)}%`
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function ScalabilitySlide() {
  const phases = [
    [
      "المرحلة الأولى",
      "تأهيل وتشغيل الشارع موضوع المشروع وقياس الأداء الفعلي.",
    ],
    [
      "المرحلة الثانية",
      "ربط الفروع التراثية المجاورة بالهوية والإرشاد والخدمات الرقمية والفعاليات.",
    ],
    [
      "المرحلة الثالثة",
      "إنشاء منطقة تراثية مترابطة ترتبط بأبو نؤاس والسعدون والكورنيش والفنادق المحيطة.",
    ],
  ];

  const axes = [
    "توثيق البيوت التراثية في الفروع المجاورة.",
    "تحديد العقارات ذات الأولوية.",
    "توحيد الهوية العمرانية والإرشادية.",
    "توسيع الجولات والمسارات السياحية.",
    "طرح فرص استثمارية جديدة.",
    "ربط المنطقة بالفنادق وشركات السياحة.",
    "إنشاء تقويم فعاليات موحد.",
    "توسيع المنصة الرقمية لتشمل المنطقة بأكملها.",
  ];

  return (
    <div className="scalability-layout">
      <div className="expansion-map" aria-label="مخطط توسع مبدئي">
        <span className="center-node">الشارع موضوع المشروع</span>
        <span>فروع تراثية مجاورة</span>
        <span>مسارات ثقافية</span>
        <span>خدمات رقمية</span>
        <span>فنادق وكورنيش</span>
        <p>[تضاف حدود ومواقع مراحل التوسع بعد المسح الميداني]</p>
      </div>
      <div className="scale-content">
        <div className="phase-grid">
          {phases.map(([phase, text]) => (
            <article key={phase}>
              <strong>{phase}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="axis-grid">
          {axes.map((axis) => (
            <span key={axis}>{axis}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapImageSlide({ slide }: { slide: Slide }) {
  const image = slide.mapImage;
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    resetZoom();
    pointers.current.clear();
    pinchStart.current = null;
    dragStart.current = null;
  }, [resetZoom]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };
    document.documentElement.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, isOpen]);

  if (!image) return null;

  const isTargetedPropertiesMap = Boolean(image.showPropertyLegend);

  const zoomBy = (amount: number) => {
    setScale((current) => Math.min(4, Math.max(1, Number((current + amount).toFixed(2)))));
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.18 : -0.18);
  };

  const pointerDistance = () => {
    const values = Array.from(pointers.current.values());
    if (values.length < 2) return 0;
    return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      pinchStart.current = { distance: pointerDistance(), scale };
      dragStart.current = null;
      return;
    }

    if (scale > 1) {
      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        px: position.x,
        py: position.y,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const next = pinchStart.current.scale * (pointerDistance() / pinchStart.current.distance);
      setScale(Math.min(4, Math.max(1, Number(next.toFixed(2)))));
      return;
    }

    if (dragStart.current && scale > 1) {
      setPosition({
        x: dragStart.current.px + event.clientX - dragStart.current.x,
        y: dragStart.current.py + event.clientY - dragStart.current.y,
      });
    }
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
    if (scale <= 1) setPosition({ x: 0, y: 0 });
  };

  return (
    <div className={`map-image-slide ${isTargetedPropertiesMap ? "has-property-legend" : ""}`}>
      <div className="map-image-layout">
      <button
        aria-label={`فتح ${image.alt}`}
        className="map-image-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Image
          alt={image.alt}
          className="map-slide-image"
          height={image.height}
          priority={image.src.includes("location-on-map")}
          src={image.src}
          width={image.width}
        />
      </button>
      {isTargetedPropertiesMap ? (
        <aside className="property-map-legend" aria-label="توضيح ألوان العقارات">
          <strong>توضيح ألوان العقارات</strong>
          <div className="property-legend-item">
            <span className="property-legend-swatch is-restoration" />
            <div>
              <b>عقارات مستهدفة للترميم وإعادة التأهيل</b>
              <p>يمثل اللون الأخضر العقارات التي تحتاج إلى معالجة عمرانية وترميم ضمن نطاق المشروع.</p>
            </div>
          </div>
          <div className="property-legend-item">
            <span className="property-legend-swatch is-existing" />
            <div>
              <b>عقارات قائمة لا تحتاج إلى ترميم</b>
              <p>يمثل اللون الأزرق مشاريع قائمة ومالكوها حاليون، وتشمل الفندق، متحف بيت التحفيات، وبوابة آسيا للتأمين.</p>
            </div>
          </div>
          <div className="property-legend-item">
            <span className="property-legend-swatch is-demolition" />
            <div>
              <b>عقارات متهالكة تحتاج إلى إزالة</b>
              <p>يمثل اللون الأحمر العقارات ذات الحالة الإنشائية المتدهورة والتي تتطلب الهدم ضمن خطة معالجة النطاق.</p>
            </div>
          </div>
        </aside>
      ) : null}
      </div>

      {isOpen ? (
        <div className="map-lightbox" data-prevent-slide-navigation="true" role="dialog" aria-modal="true">
          <div className="map-lightbox-toolbar" aria-label="التحكم بالصورة">
            <button aria-label="تكبير" onClick={() => zoomBy(0.25)} type="button">
              <ZoomIn size={18} />
            </button>
            <button aria-label="تصغير" onClick={() => zoomBy(-0.25)} type="button">
              <ZoomOut size={18} />
            </button>
            <button aria-label="إعادة الضبط" onClick={resetZoom} type="button">
              <RotateCcw size={18} />
            </button>
            <button aria-label="إغلاق" onClick={closeLightbox} type="button">
              <X size={20} />
            </button>
          </div>
          <div
            className={`map-lightbox-stage ${scale > 1 ? "is-zoomed" : ""}`}
            onPointerCancel={onPointerEnd}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onWheel={onWheel}
          >
            <Image
              alt={image.alt}
              className="map-lightbox-image"
              draggable={false}
              height={image.height}
              src={image.src}
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
              width={image.width}
            />
          </div>
          <div className="map-lightbox-caption">
            <strong>{slide.title}</strong>
            <span>{Math.round(scale * 100)}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PreparedByBadge() {
  return (
    <div className="prepared-by-badge">
      <Image
        alt="شعار أبعاد العراق"
        className="prepared-by-logo"
        height={2000}
        priority
        src="/images/abaad-logo.png"
        width={2000}
      />
      <span>تم إعداد العرض التقديمي بواسطة مكتب أبعاد العراق للحلول البرمجية</span>
    </div>
  );
}

type GalleryImageItem =
  | (typeof currentStreetGallery)[number]
  | (typeof visionStreetGallery)[number];

function isGalleryImageAvailable(item: GalleryImageItem) {
  return !("available" in item) || item.available;
}

function GallerySlide({ kind }: { kind: "current" | "vision" }) {
  const gallery =
    kind === "current" ? currentStreetGallery : visionStreetGallery;
  const oppositeGallery =
    kind === "current" ? visionStreetGallery : currentStreetGallery;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareValue, setCompareValue] = useState(50);
  const activeItem = activeIndex === null ? null : gallery[activeIndex];
  const oppositeItem = activeItem
    ? oppositeGallery.find((item) => item.id === activeItem.id)
    : undefined;
  const canCompare =
    activeItem !== null &&
    Boolean(oppositeItem) &&
    isGalleryImageAvailable(activeItem) &&
    isGalleryImageAvailable(oppositeItem as GalleryImageItem);
  const compareButtonLabel = kind === "current" ? "بعد" : "قبل";

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setCompareMode(false);
    setCompareValue(50);
  }, []);

  const goLightbox = useCallback(
    (direction: number) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return (current + direction + gallery.length) % gallery.length;
      });
      setCompareMode(false);
      setCompareValue(50);
    },
    [gallery.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goLightbox(1);
      if (event.key === "ArrowRight") goLightbox(-1);
    };

    document.documentElement.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, goLightbox]);

  return (
    <div className="masonry-gallery">
      <motion.div
        className="gallery-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={cardGroupVariants}
      >
        {gallery.map((item, index) => (
          <motion.figure
            className={`gallery-item gallery-item-${item.orientation}`}
            key={item.id}
            variants={cardVariants}
          >
            <button
              aria-label={`فتح ${item.title}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {isGalleryImageAvailable(item) ? (
                <Image
                  alt={item.title}
                  className="gallery-image"
                  height={item.height}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
                  src={item.src}
                  width={item.width}
                />
              ) : (
                <div
                  className="gallery-placeholder"
                  style={{ aspectRatio: `${item.width} / ${item.height}` }}
                >
                  <strong>صورة الرؤية مطلوبة</strong>
                  <span>{item.src}</span>
                </div>
              )}
            </button>
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>

      {activeItem ? (
        <div
          className="gallery-lightbox"
          data-prevent-slide-navigation="true"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="إغلاق العرض الموسع"
            className="lightbox-close"
            onClick={closeLightbox}
            type="button"
          >
            <X size={22} />
          </button>
          <button
            aria-label="الصورة السابقة"
            className="lightbox-arrow lightbox-prev"
            onClick={() => goLightbox(-1)}
            type="button"
          >
            <ArrowRight size={24} />
          </button>
          <div className="lightbox-stage">
            {compareMode && canCompare && oppositeItem ? (
              <div
                className="lightbox-compare"
                style={{
                  aspectRatio: `${activeItem.width} / ${activeItem.height}`,
                }}
              >
                <Image
                  alt={activeItem.title}
                  height={activeItem.height}
                  src={activeItem.src}
                  width={activeItem.width}
                />
                <div
                  className="lightbox-compare-after"
                  style={{ width: `${compareValue}%` }}
                >
                  <Image
                    alt={oppositeItem.title}
                    height={oppositeItem.height}
                    src={oppositeItem.src}
                    width={oppositeItem.width}
                  />
                </div>
                <input
                  aria-label="مقارنة قبل وبعد"
                  max={100}
                  min={0}
                  onChange={(event) => setCompareValue(Number(event.target.value))}
                  type="range"
                  value={compareValue}
                />
              </div>
            ) : isGalleryImageAvailable(activeItem) ? (
              <Image
                alt={activeItem.title}
                className="lightbox-image"
                height={activeItem.height}
                src={activeItem.src}
                width={activeItem.width}
              />
            ) : (
              <div
                className="lightbox-placeholder"
                style={{ aspectRatio: `${activeItem.width} / ${activeItem.height}` }}
              >
                <strong>صورة الرؤية مطلوبة</strong>
                <span>{activeItem.src}</span>
              </div>
            )}
            <div className="lightbox-caption">
              <span>
                {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(gallery.length).padStart(2, "0")}
              </span>
              <strong>{activeItem.title}</strong>
              <p>{activeItem.description}</p>
              {canCompare ? (
                <button
                  className={compareMode ? "is-active" : ""}
                  onClick={() => setCompareMode((current) => !current)}
                  type="button"
                >
                  {compareMode ? "إخفاء المقارنة" : compareButtonLabel}
                </button>
              ) : null}
            </div>
          </div>
          <button
            aria-label="الصورة التالية"
            className="lightbox-arrow lightbox-next"
            onClick={() => goLightbox(1)}
            type="button"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function HeritagePresentation() {
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wheelLock = useRef(false);
  const wheelDelta = useRef(0);
  const wheelDirection = useRef<1 | -1 | 0>(0);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  const progress = useMemo(
    () => ((active + 1) / slides.length) * 100,
    [active],
  );

  const goTo = useCallback((index: number) => {
    const next = clampSlide(index);
    setActive(next);
    const scrollContainer = slideRefs.current[next]?.querySelector(
      "[data-slide-scroll]",
    );
    if (scrollContainer instanceof HTMLElement) scrollContainer.scrollTop = 0;
    slideRefs.current[next]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.defaultPrevented ||
        target?.closest("input, button, [role='slider'], [role='dialog']")
      ) {
        return;
      }
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(active + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(active - 1);
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(slides.length - 1);
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, goTo, toggleFullscreen]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (isSlideNavigationBlocked(event.target) || wheelLock.current) return;

      const eventTarget = event.target as Element | null;
      const currentSlide = slideRefs.current[active];
      const scrollContainer =
        eventTarget?.closest("[data-slide-scroll]") ??
        currentSlide?.querySelector("[data-slide-scroll]");

      if (!(scrollContainer instanceof HTMLElement)) return;

      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const atTop = scrollContainer.scrollTop <= 2;
      const atBottom = scrollContainer.scrollTop >= maxScroll - 2;
      const direction = event.deltaY > 0 ? 1 : -1;

      if (maxScroll > 2) {
        if (direction > 0 && !atBottom) {
          wheelDelta.current = 0;
          wheelDirection.current = 0;
          return;
        }

        if (direction < 0 && !atTop) {
          wheelDelta.current = 0;
          wheelDirection.current = 0;
          return;
        }
      }

      if (wheelDirection.current !== direction) {
        wheelDelta.current = 0;
        wheelDirection.current = direction;
      }

      wheelDelta.current += event.deltaY;
      if (Math.abs(wheelDelta.current) < 120) return;

      wheelDelta.current = 0;
      wheelLock.current = true;
      goTo(active + direction);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 860);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [active, goTo]);

  return (
    <main
      className="presentation-shell"
      aria-label="عرض مشروع تأهيل واستثمار الشارع التراثي في أبو نؤاس"
    >
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="deck-controls" aria-label="التحكم بالعرض">
        <button onClick={() => goTo(active - 1)} aria-label="الشريحة السابقة">
          <ArrowUp size={18} />
        </button>
        <strong>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </strong>
        <button onClick={() => goTo(active + 1)} aria-label="الشريحة التالية">
          <ArrowDown size={18} />
        </button>
        <button onClick={toggleFullscreen} aria-label="وضع ملء الشاشة">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <nav className="slide-dots" aria-label="فهرس الشرائح">
        {slides.map((slide, index) => (
          <button
            aria-label={`اذهب إلى ${slide.eyebrow}`}
            className={index === active ? "is-active" : ""}
            key={slide.eyebrow}
            onClick={() => goTo(index)}
          />
        ))}
      </nav>

      {slides.map((slide, index) => (
        <section
          className={`presentation-slide slide slide-${slide.variant ?? "standard"} ${
            slide.custom === "location" ? "location-slide" : ""
          }`}
          id={`slide-${index + 1}`}
          key={slide.eyebrow}
          ref={(element) => {
            slideRefs.current[index] = element;
          }}
        >
          {slide.image ? (
            <Image
              alt=""
              className="slide-image"
              fill
              priority={index < 2}
              sizes="100vw"
              src={slide.image}
              style={{ objectPosition: slide.imagePosition ?? "center center" }}
            />
          ) : null}
          <div className="slide-shade" />
          <div className="baghdad-pattern" aria-hidden="true" />
          <div className="slide-number">{slide.eyebrow}</div>

          <div className="slide-scroll" data-slide-scroll>
            <div className="slide-content">
            {slide.custom === "location" ? (
              <LocationSlide slide={slide} />
            ) : (
              <>
                {index === 0 ? <PreparedByBadge /> : null}
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1>{slide.title}</h1>
                {slide.subtitle ? (
                  <p className="subtitle">{slide.subtitle}</p>
                ) : null}
                {slide.body ? (
                  <p className="body">{renderLinkedText(slide.body)}</p>
                ) : null}
              </>
            )}

            {slide.custom === "women" ? <WomenEmpowermentSlide /> : null}
            {slide.custom === "revenue" ? <RevenueModelSlide /> : null}
            {slide.custom === "calculator" ? <FinancialCalculatorSlide /> : null}
            {slide.custom === "scalability" ? <ScalabilitySlide /> : null}
            {slide.custom === "gallery" && slide.galleryKind ? (
              <GallerySlide kind={slide.galleryKind} />
            ) : null}
            {slide.custom === "mapImage" ? <MapImageSlide slide={slide} /> : null}

            {!slide.custom && slide.metrics ? (
              <motion.div
                className="metric-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={cardGroupVariants}
              >
                {slide.metrics.map((metric) => (
                  <motion.article
                    className="metric-card"
                    key={metric.value}
                    variants={cardVariants}
                  >
                    <strong>{metric.value}</strong>
                    <span>{renderLinkedText(metric.text)}</span>
                  </motion.article>
                ))}
              </motion.div>
            ) : null}

            {!slide.custom && slide.map ? (
              <aside className="map-panel" aria-label={slide.map.title}>
                <div className="map-copy">
                  <strong>{slide.map.title}</strong>
                  <span>{slide.map.subtitle}</span>
                </div>
                <div className="map-frame">
                  <iframe
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={slide.map.embedUrl}
                    title={slide.map.title}
                  />
                </div>
                <a
                  className="map-open-link"
                  href={slide.map.openUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  فتح الموقع على خرائط Google
                </a>
              </aside>
            ) : null}

            {!slide.custom && slide.placeholder ? (
              <div className="placeholder-box">
                {renderLinkedText(slide.placeholder)}
              </div>
            ) : null}

            {!slide.custom && slide.bullets ? (
              <ul className="bullet-list">
                {slide.bullets.map((bullet) => (
                  <li key={bullet}>{renderLinkedText(bullet)}</li>
                ))}
              </ul>
            ) : null}

            {!slide.custom && slide.pillars ? (
              <motion.div
                className="pillar-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                variants={cardGroupVariants}
              >
                {slide.pillars.map((pillar) => (
                  <motion.article key={pillar.label} variants={cardVariants}>
                    <span>{pillar.label}</span>
                    <p>{renderLinkedText(pillar.text)}</p>
                  </motion.article>
                ))}
              </motion.div>
            ) : null}

            {!slide.custom && slide.items ? (
              <motion.div
                className="item-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={cardGroupVariants}
              >
                {slide.items.map((item, itemIndex) => (
                  <motion.span key={item} variants={cardVariants}>
                    <b>{String(itemIndex + 1).padStart(2, "0")}</b>
                    {renderLinkedText(item)}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}

            {!slide.custom && slide.journey ? (
              <motion.div
                className="journey-line"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={cardGroupVariants}
              >
                {slide.journey.map((step, stepIndex) => (
                  <motion.span
                    key={step}
                    data-step={String(stepIndex + 1).padStart(2, "0")}
                    variants={cardVariants}
                  >
                    {renderLinkedText(step)}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}

            {!slide.custom && slide.timeline ? (
              <motion.div
                className="timeline"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardGroupVariants}
              >
                {slide.timeline.map((phase) => (
                  <motion.article key={phase.phase} variants={cardVariants}>
                    <strong>{phase.phase}</strong>
                    <em>{phase.focus}</em>
                    <ul>
                      {phase.points.map((point) => (
                        <li key={point}>{renderLinkedText(point)}</li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </motion.div>
            ) : null}

            {!slide.custom && slide.closing ? (
              <p className="closing">{renderLinkedText(slide.closing)}</p>
            ) : null}
           {slide.credit ? (
  <div className="presentation-credit">
    <span>{slide.credit.text}</span>

    <a
      href={slide.credit.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      abaad-aliraq.com
    </a>
  </div>
) : null}
            </div>
          </div>

          {index === 0 ? (
            <button
              className="next-cue"
              onClick={() => goTo(1)}
              aria-label="انتقل إلى الشريحة التالية"
            >
              <ArrowDown size={20} />
            </button>
          ) : null}
        </section>
      ))}
    </main>
  );
}
