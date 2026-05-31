"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  ShoppingCart,
  Heart,
  Search,
  ChevronDown,
  X,
  Plus,
  Minus,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Truck,
  RotateCcw,
  MessageSquare,
  ArrowLeft,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from "lucide-react";

// Types
interface Product {
  id: number;
  name: string;
  category: "lunch" | "dinner" | "snack" | "weekly";
  price: number;
  oldPrice: number;
  badge?: string;
  badgeColor?: string;
  image: string;
  desc: string;
  ingredients: string[];
  benefits: string[];
  tags: string[];
}

interface CartItem extends Product {
  qty: number;
}

interface AICounselResult {
  estimatedCalories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  coachingAdvice: string;
  recommendedPackageId: number;
  recommendationReason: string;
}

// Static Products Data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "باقة غداء صحي – 3 أيام",
    category: "lunch",
    price: 79,
    oldPrice: 99,
    badge: "الأكثر طلباً",
    badgeColor: "bg-red-500 text-white",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    desc: "3 وجبات غداء متوازنة ومتنوعة مُعدّة من أطعمة طازجة يومياً بإشراف أخصائي تغذية. مثالية للتجربة الأولى!",
    ingredients: ["دجاج مشوي بالتوابل", "أرز بسمتي بالأعشاب", "سلطة خضراء موسمية", "صلصة زيت الزيتون والليمون"],
    benefits: ["تحسين مستويات الهضم", "إمداد سريع بالطاقة النظيفة", "توازن السكر بالدم"],
    tags: ["3 أيام", "بروتين عالٍ", "طازج يومياً"]
  },
  {
    id: 2,
    name: "باقة غداء صحي – 5 أيام",
    category: "lunch",
    price: 139,
    oldPrice: 165,
    badge: "توفير أسبوعي",
    badgeColor: "bg-green text-white",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    desc: "5 وجبات غداء غنية بالبروتين والألياف. مثالية للموظفين والرياضيين الذين يريدون الحفاظ على صحتهم طوال أيام العمل الرئيسية.",
    ingredients: ["شرائح لحم بقري ومشروم", "بطاطا حلوة مشوية", "كينوا وخضار مشوية", "صلصة حمضية صحية"],
    benefits: ["بناء واستشفاء العضلات", "إحساس مستدام بالشبع", "تنظيم معدلات الكوليسترول"],
    tags: ["5 أيام", "غني بالألياف", "خيار الموظف"]
  },
  {
    id: 3,
    name: "باقة غداء صحي – 7 أيام",
    category: "lunch",
    price: 189,
    oldPrice: 230,
    badge: "توفير متميز",
    badgeColor: "bg-amber text-zinc-900",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    desc: "أسبوع كامل من الغداء الصحي المتنوع طوال 7 أيام. استمتع بوقتك ودع مهمة الحسابات الغذائية علينا بالكامل دون ملل.",
    ingredients: ["سلمون مشوي فاخر", "أرز أحمر بري", "خضروات موسمية على البخار", "شوربة طماطم صحية"],
    benefits: ["حمية متكاملة لخفض الوزن", "تعزيز المناعة بمكونات طازجة", "سهولة تامة بدون تحضير وتعب"],
    tags: ["7 أيام", "أسبوع كامل", "سعرات محسوبة"]
  },
  {
    id: 4,
    name: "باقة عشاء صحي – 3 أيام",
    category: "dinner",
    price: 69,
    oldPrice: 89,
    badge: "خفيف وصحي",
    badgeColor: "bg-green-mid text-white",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80",
    desc: "عشاء خفيف ومُغذٍّ طازج لمدة 3 ليالٍ. مناسب جداً لمن يعانون من ثقل المعدة قبل النوم ويريدون تخسيس ذكي مريح.",
    ingredients: ["شوربة عدس فاخرة بالليمون", "توست أسمر محمص بروتين", "سلطة يونانية بجبن قليل الدسم", "أفوكادو"],
    benefits: ["نوم مريح وعميق دون قلق", "هضم خفيف وسريع", "إنقاص طبيعي للوزن بدون تجويع"],
    tags: ["3 أيام", "خفيف جداً", "قليل الكربوهيدرات"]
  },
  {
    id: 5,
    name: "باقة عشاء صحي – 5 أيام",
    category: "dinner",
    price: 129,
    oldPrice: 149,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    desc: "5 وجبات عشاء صحية متكاملة، منخفضة الكربوهيدرات وغنية بمضادات الأكسدة والبروتين النظيف لراحة مثالية قبل النوم.",
    ingredients: ["صدور دجاج متبلة بالأعشاب", "شوربة قرع وبطاطا خفيفة", "سلطة كينوا بالرمان والمكسرات"],
    benefits: ["تسريع معدلات حرق الدهون الليلية", "تحسين جودة البشرة ونشاطها", "تعزيز صحة الكليتين والكبد"],
    tags: ["5 أيام", "منخفض السعرات", "صديق الهضم"]
  },
  {
    id: 6,
    name: "باقة عشاء صحي – 7 أيام",
    category: "dinner",
    price: 179,
    oldPrice: 210,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    desc: "أسبوع مغذٍّ متكامل من وجبات العشاء الصحية الخفيفة والشهية لـ7 أيام متتالية، تضمن لك عادات نوم مثالية ووزن محكم.",
    ingredients: ["سمك أبيض مشوي بالأعشاب البرية", "سلطة البروكلي والسبانخ", "سناكس فواكه مجففة خفيفة"],
    benefits: ["مثالي لاستقرار مستويات سكر الدم", "تقوية عضلات القلب والأوعية الدموية", "توازن هرموني ممتاز"],
    tags: ["7 أيام", "عشاء متكامل", "ألياف عالية"]
  },
  {
    id: 7,
    name: "باقة سناك صحي – 5 أيام",
    category: "snack",
    price: 99,
    oldPrice: 129,
    badge: "عرض رائع",
    badgeColor: "bg-emerald-600 text-white",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
    desc: "5 أيام من السناكس والوجبات الخفيفة والذكية لتناولها بين الفطور والغداء، أو الغداء والعشاء، لتمنحك نشاطاً مستمراً.",
    ingredients: ["مكسرات مشكلة نيئة وغير مملحة", "ألواح بروتين بار طبيعية", "شرائح فواكه موسمية طازجة", "عصائر طبيعية باردة"],
    benefits: ["طاقة سريعة ومميزة أثناء العمل", "حرق الدهون ومنع الجوع العنيف", "سناك مدروس قليل الكربوهيدرات"],
    tags: ["5 أيام", "طاقة مستمرة", "طبيعي 100%"]
  },
  {
    id: 8,
    name: "باقة سناك صحي – 7 أيام",
    category: "snack",
    price: 139,
    oldPrice: 179,
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80",
    desc: "باقة سناكس متكاملة لـ7 أيام كاملة، تغنيك عن الشوكولاتة الضارة ورقائق البطاطس المصنعة وتعطيك غذاء مدهشاً في جيبك.",
    ingredients: ["مكعبات شوكولاتة داكنة للريجيم", "بذور الشيا والكتان العضوية", "عصير حامض بالتفاح الأخضر", "شاي أخضر للتخسيس"],
    benefits: ["تحفيز الذاكرة والقدرة الذهنية", "الشعور التام بالشبع والرضا", "التخلص السريع من السموم بالجسم"],
    tags: ["7 أيام", "مناسب للعمل", "مضادات أكسدة"]
  },
  {
    id: 9,
    name: "باقة الأسبوع الكامل الصحي",
    category: "weekly",
    price: 319,
    oldPrice: 399,
    badge: "الأكثر تميزاً لبدء دايت",
    badgeColor: "bg-green-dark text-white font-bold",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    desc: "باقة ذهبية متكاملة تجمع: غداء + عشاء + سناك لمدة 7 أيام كاملة. الخيار الأفضل والأكثر بساطة للباحثين عن تحول جذري في صحتهم ووزنهم.",
    ingredients: ["21 وجبة رئيسية وصحية مشكلة", "7 سناكس عالية الطاقة", "عصائر طبيعية ومشروبات شاي دايت متكاملة"],
    benefits: ["تغيير شامل في طاقة الجسم والأيض", "إنقاص سريع وفعال للوزن الزائد", "توفير مادي وعقلي هائل وسهول تامة"],
    tags: ["7 أيام", "3 وجبات باليوم", "شامل وصحي"]
  },
  {
    id: 10,
    name: "باقة الكيتو الأسبوعية",
    category: "weekly",
    price: 279,
    oldPrice: 349,
    badge: "كيتو صحي",
    badgeColor: "bg-indigo-600 text-white",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    desc: "وجبات كيتو مدروسة بدقة متناهية لمن يتبعون الكيتو دايت. دهون صحية ممتازة، بروتين موزون وأقل من 20 جرام كربوهيدرات يومياً.",
    ingredients: ["نصف ثمرة أفوكادو طازجة يومياً", "أسماك دسمة وصدور دجاج", "بيض عضوي مطبوخ بزبدة طبيعية", "ورقيات خضراء مشكلة"],
    benefits: ["دخول فوري وسلس في الحالة الكيتونية", "تنظيم وضبط مستويات السكر والأنسولين", "تنشيط سريع للقدرات الإدراكية وطاقة حيوية غامرة"],
    tags: ["الكيتو دايت", "بدون غلوتين", "دهون صحية ممتازة"]
  },
  {
    id: 11,
    name: "باقة نباتية أسبوعية",
    category: "weekly",
    price: 259,
    oldPrice: 329,
    badge: "نباتي 100%",
    badgeColor: "bg-green-700 text-white",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    desc: "وجبات نباتية ممتازة خالية 100% من اللحوم ومشتقات الأقوات الاصطناعية، تعتمد على بروتين نباتي غني بالفيتامينات والمعادن الهامة وصديقة تماماً للبيئة.",
    ingredients: ["بروتين الصويا والتوفو الطازج", "عدس وبقوليات متبلة بالأعشاب", "خضروات موسمية طازجة وعضوية", "مكسرات نيئة ممتازة"],
    benefits: ["تخفيف الكوليسترول وحموضة المعدة", "تنظيف دائم للمجرى الهضمي", "بيئة وجسم أنظف وخالي من الدهون الضارة"],
    tags: ["نباتي بالكامل", "غني بالألياف والحديد", "طازج ونباتي"]
  },
  {
    id: 12,
    name: "باقة العائلة الأسبوعية",
    category: "weekly",
    price: 479,
    oldPrice: 599,
    badge: "لتحسين صحة العائلة",
    badgeColor: "bg-pink-600 text-white",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    desc: "صممنا هذه الباقة المميزة لـ4 أشخاص للاستخدام الأسبوعي. وفّر وقت الطبخ وحسّن صحة أطفالك وشريك حياتك مع غداءات صحية ممتعة يومية.",
    ingredients: ["وجبات رئيسية متنوعة لـ4 أشخاص طوال الأسبوع", "أطعمة عربية غنية ومحبوبة للأطفال بطرق صحية ولطيفة"],
    benefits: ["تربية جيل جديد على نمط الحياة المتوازن", "توفير مالي كبير يصل لـ20% من الشراء الفردي", "قضاء وقت عائلي طهي بدون كركبة المطبخ وضغطه"],
    tags: ["لـ 4 أشخاص", "أفضل حماية عائلية", "تنوع غذائي هائل"]
  }
];

// FAQs Data Simplified
const FAQ_CATEGORIES = [
  { id: "all", name: "الكل" },
  { id: "orders", name: "الطلبات" },
  { id: "products", name: "المنـتجات" },
  { id: "delivery", name: "التوصيل" },
  { id: "payment", name: "الدفع والأمـور المالية" }
];

const FAQS = [
  {
    q: "كيف أطلب وجباتي المفضلة من جرين دايت؟",
    a: "الطلب سهل وسلس بالكامل! يكفيك تصفح الباقات، واختيار الفترة التي تناسبك ثم الضغط على زر الإضافة للسلة. بعد التأكيد ستتلقى رسالة مشجعة عبر واتساب تتضمن الفاتورة وتفاصيل جدول التوصيل اليومي.",
    category: "orders"
  },
  {
    q: "هل يمكنني إلغاء أو تغيير الباقة بعد إتمام الشراء؟",
    a: "نحن نمرن خططنا بمرونة لراحتك. يحق لك التعديل وتغيير العنوان أو الوجبات طالما لم يبدأ مطبخنا بالتحضير الفعلي (بحد أقصى ساعتين بعد الدفع). تواصل مع خدمة العملاء لمساعدتك فوراً.",
    category: "orders"
  },
  {
    q: "هل وجبات جرين دايت طازجة يومياً أم مجمدة؟",
    a: "طازج وبأعلى جودة دائماً! كل طبق يتم إعداده وطهيه في الصباح الباكر يوم التوصيل باستخدام خضار ومصادر بروتينية طازجة محلية. نحن لا نقوم بالتجميد مطلقاً حفاظاً على الفيتامينات والقيمة الحيوية لأطباقنا.",
    category: "products"
  },
  {
    q: "ماذا يغطي اشتراك غداء صحي أو عشاء صحي؟",
    a: "الباقات صُممت لتلبي احتياجاتك؛ باقة الغداء تغطي وجبة نهارية غنية بالبروتينات والبرواكتيف، والعشاء وجبة مريحة خفيفة منخفضة السعرات لنوم صحي، والسناك يوفر طاقة ممتازة وخفيفة لمنتصف النهار.",
    category: "products"
  },
  {
    q: "ما هي المدن السعودية المشمولة بخدمة التوصيل؟",
    a: "نسعد بخدمتكم وتوصيل وجباتكم يومياً في المدن التالية: الرياض، جدة، مكة المكرمة، والدمام والخبر ومراكزها الرئيسية، والمدينة المنورة، وقريباً تفتتح فروعنا في بقية مناطق المملكة.",
    category: "delivery"
  },
  {
    q: "كيف تحافظون على برودة وسلامة الوجبة أثناء انتقالها لشقتي أو مكتبي؟",
    a: "أمانك وصحتك أولويتنا؛ تنتقل الوجبات في أسطول سيارات مبردة بدرجة 4 مئوية مخصصة للنقل الطبي والأغذية، داخل عبوات حرارية مضغوطة صديقة للبيئة تضمن بقائها طازجة لمدة تزيد عن 8 ساعات.",
    category: "delivery"
  },
  {
    q: "ما هي طرق وبروتوكولات الدفع المتاحة لجرين دايت؟",
    a: "ندعم جميع قنوات الدفع الآمنة المعتمدة لدى البنك المركزي السعودي، ومنها: مدى، Apple Pay، الفيزا، الماستركارد، وخاصية تقسيط ميزانيتك عبر تابي تيسيراً لعافيتك وصحتك.",
    category: "payment"
  },
  {
    q: "هل توجد رسوم خفية أو إضافية للتوصيل والخدمة؟",
    a: "الشفافية والصدق مبدأنا. الأسعار الموضحة تشمل الخدمة والضريبة بالكامل، والتوصيل مجاني تماماً لطلبات الاشتراكات الأسبوعية وكذلك الطلبات التي تتجاوز قيمتها 200 ريال سعودي.",
    category: "payment"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "shipping" | "returns" | "faq" | "contact">("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // FAQ State
  const [faqCat, setFaqCat] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState<string>(" ");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "استفسار عن المنتجات والباقات",
    orderId: "",
    message: ""
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // AI Nutrition Goal Advisor State
  const [aiForm, setAiForm] = useState({
    name: "",
    weight: "",
    height: "",
    age: "",
    goal: "فقدان الوزن الزائد ودهون البطن وسرعة الرشاقة",
    activity: "نشاط بدني متوسط (مشي ٣ مرات بالأسبوع، حركة مستمرة)",
    allergies: "لا يوجد لدي خطوط حمراء أو حساسية طعام معينة",
    preferredCategories: ["weekly"]
  });
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AICounselResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get stored items safely deferred to prevent cascading renders
    const savedCart = localStorage.getItem("gd_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setTimeout(() => {
          setCart(parsed);
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }
    const savedFavs = localStorage.getItem("gd_favs");
    if (savedFavs) {
      try {
        const parsedFavs = JSON.parse(savedFavs);
        setTimeout(() => {
          setFavorites(new Set(parsedFavs));
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const saveCartToStorage = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("gd_cart", JSON.stringify(updated));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product: Product, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    const existing = cart.find((item) => item.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...cart, { ...product, qty: 1 }];
    }
    saveCartToStorage(updated);
    showToast(`تم إضافة "${product.name}" إلى سلتك بنجاح 🌿`);
  };

  const removeFromCart = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCartToStorage(updated);
    showToast("تم إزالة المنتج من السلة");
  };

  const updateQuantity = (id: number, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty <= 0 ? null : { ...item, qty: newQty };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCartToStorage(updated);
  };

  const toggleFavorite = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedFavs = new Set(favorites);
    if (updatedFavs.has(id)) {
      updatedFavs.delete(id);
      showToast("تم إزالة الباقة من المفضلة");
    } else {
      updatedFavs.add(id);
      showToast("تمت إضافة الباقة إلى مفضلتك الشخصية ❤️");
    }
    setFavorites(updatedFavs);
    localStorage.setItem("gd_favs", JSON.stringify(Array.from(updatedFavs)));
  };

  // Contact Form Submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      showToast("يرجى تعبئة الحقول الأساسية المطلوبة.");
      return;
    }
    setSubmittingContact(true);
    setTimeout(() => {
      setContactSuccess(true);
      setSubmittingContact(false);
      showToast("تم إرسال رسالتك بنجاح! يسعدنا خدمتكم.");
    }, 1200);
  };

  // AI Nutrition Form Submission to server
  const handleAICounselSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiForm.weight || !aiForm.height || !aiForm.age) {
      showToast("يرجى كتابة الوزن والطول والعمر لتقدير السعرات.");
      return;
    }
    setAiCoachLoading(true);
    setAiResult(null);
    setAiError(null);

    try {
      const response = await fetch("/api/gemini/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "عذراً، فشلت عملية الاتصال بالذكاء الاصطناعي.");
      }
      const data: AICounselResult = await response.json();
      setAiResult(data);
      showToast("لقد حلل أخصائي التغذية بياناتك بنجاح!");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "تعذر الاتصال بمستشار التغذية حالياً، يرجى المحاولة لاحقاً.");
    } finally {
      setAiCoachLoading(false);
    }
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeDelivery = cartSubtotal >= 200;
  const deliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : 15;
  const cartTotal = cartSubtotal + deliveryFee;

  // Filter products
  const filteredProducts =
    activeCategoryFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategoryFilter);

  // Filter FAQs
  const faqSearchNormalized = faqSearch.trim().toLowerCase();
  const filteredFAQs = FAQS.filter((f) => {
    const matchesCategory = faqCat === "all" || f.category === faqCat;
    const matchesSearch =
      faqSearchNormalized === "" ||
      f.q.toLowerCase().includes(faqSearchNormalized) ||
      f.a.toLowerCase().includes(faqSearchNormalized);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans select-none overflow-x-hidden pb-16 sm:pb-0">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-3"
          >
            <div className="bg-green-light text-green p-2 rounded-xl">
              <Leaf size={18} />
            </div>
            <div className="flex-1 text-sm font-medium">{toastMessage}</div>
            <button onClick={() => setToastMessage(null)} className="text-zinc-500 hover:text-white transition">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 h-20 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_4px_30px_rgba(26,158,110,0.08)] border-b border-green-light"
            : "bg-white/70 backdrop-blur-md border-b border-green-light/30"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("home");
              }}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-green/30 rounded-3xl group transition-transform duration-300 hover:scale-105"
              id="brand-logo"
            >
              <div className="relative h-12 px-4 bg-white border border-green-light rounded-3xl shadow-sm shadow-green-950/5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-green">
                <Image
                  src="/logo.svg"
                  alt="جرين دايت - Green Diet"
                  width={90}
                  height={28}
                  className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>

            {/* Desktop Nav links */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#e8f7f0]/40 p-1 rounded-2xl border border-green-light">
              <button
                onClick={() => setActiveTab("home")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "home" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                الرئيسية والمـتجر
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "about" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                من نحنُ
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "shipping" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                الشحن والتوصيل
              </button>
              <button
                onClick={() => setActiveTab("returns")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "returns" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                المرتجعات والضمان
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "faq" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                الأسئلة الشائعة
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "contact" ? "bg-green text-white shadow-md shadow-green/20" : "text-zinc-600 hover:text-green"
                }`}
              >
                تواصل معنا
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Favorites indicators or cart toggle */}
            <button
              onClick={() => {
                setCartOpen(true);
              }}
              className="bg-green hover:bg-green-dark text-white rounded-2xl px-5 h-12 flex items-center justify-center gap-2 font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-green/20"
              id="cart-toggle-btn"
            >
              <ShoppingCart size={18} />
              <span className="hidden md:inline">السلة</span>
              <span className="w-5 h-5 rounded-full bg-accent text-zinc-900 flex items-center justify-center text-xs font-black animate-pulse">
                {cart.reduce((s, item) => s + item.qty, 0)}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-green-light text-green flex items-center justify-center hover:bg-green hover:text-white transition"
            >
              <Leaf size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-80 bg-white h-full p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-green-dark">قائمة المعرفة</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { key: "home", label: "الرئيسية والمـتجر" },
                    { key: "about", label: "من نحنُ" },
                    { key: "shipping", label: "الشحن والتوصيل" },
                    { key: "returns", label: "المرتجعات والضمان" },
                    { key: "faq", label: "الأسئلة الشائعة" },
                    { key: "contact", label: "تواصل معنا" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-right p-3.5 rounded-xl font-bold text-sm transition ${
                        activeTab === tab.key ? "bg-green-light text-green-dark" : "hover:bg-zinc-50 text-zinc-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6">
                <div className="text-xs text-zinc-400 font-bold mb-3">دعم متاح 24/7 بالسعودية</div>
                <a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-sm w-full"
                >
                  <MessageSquare size={16} />
                  <span>تواصل بواتساب الدعم</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER ACTIVE TAB */}
      <main className="flex-1 pt-24 min-h-screen">
        {activeTab === "home" && (
          <div className="flex flex-col gap-16 pb-16">
            
            {/* HERO HERO SECTION */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 sm:pt-16 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start gap-6 text-right relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-light text-green-dark text-xs font-black">
                  <Sparkles size={14} className="animate-spin" />
                  <span>الأول في المملكة العربية السعودية 🇸🇦</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 leading-tight">
                  وجباتك التغذوية
                  <span className="block text-green-dark">طازجة، لباب منزلك</span>
                  يومياً بضمان 100% 🌿
                </h1>
                <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-lg">
                  باقات وجبات صحية وعضوية مصممة بعناية مطلقة مع إخصائيين تغذية معتمدين وطهاة دوليين. نوفر لك الجهد، ونبني لك طاقة حقيقية ونساعدك في الوصول لوزنك المثالي.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const el = document.getElementById("store-products");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-green hover:bg-green-dark text-white text-base font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-green/20 hover:-translate-y-0.5 transition duration-300"
                  >
                    تصفح الباقات الصحية
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("ai-coach-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-white border-2 border-green text-green hover:bg-green-light text-base font-extrabold px-8 py-4 rounded-2xl transition duration-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    <span>مسبار التغذية الذكي</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-100 w-full max-w-md">
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-green-dark">+8000</span>
                    <span className="text-[11px] text-zinc-400 font-bold">عميل راضٍ ومستمر</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-green-dark">5★</span>
                    <span className="text-[11px] text-zinc-400 font-bold">تقييم عافية عالي</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-green-dark">100%</span>
                    <span className="text-[11px] text-zinc-400 font-bold">طازج غير مجمد</span>
                  </div>
                </div>
              </div>

              {/* Graphical Hero Badge Element */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 bg-green-light rounded-[40px] rotate-3 -z-10 blur-xl opacity-60"></div>
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white max-w-lg w-full transform -rotate-1 hover:rotate-0 transition duration-500">
                  <div className="absolute top-4 right-4 z-10 bg-zinc-900/90 text-white rounded-xl p-3 text-xs font-bold shadow-lg flex items-center gap-2">
                    <Sparkles size={14} className="text-accent" />
                    <span>خصم ترحيبي 25% للعملاء الجدد</span>
                  </div>
                  <div className="relative h-[250px] sm:h-[400px]">
                    <Image
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=80"
                      alt="جرين دايت صحي"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-white p-6 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-400">تحضير يومي مخصص</span>
                      <span className="text-base font-black text-zinc-900">سلطات ومأكولات غنية بالمركبات الحيوية</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-zinc-400">يبدأ من</span>
                      <span className="text-lg font-black text-green-dark">69 ريال</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI NUTRITION ADVISOR SECTION (GEMINI POWERED) */}
            <section
              id="ai-coach-section"
              className="bg-zinc-900 text-white py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-[36px] shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-green opacity-20 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent opacity-10 blur-3xl rounded-full"></div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column Input */}
                <div className="lg:col-span-5 flex flex-col gap-5 text-right">
                  <div className="inline-flex self-start items-center gap-2 bg-green/20 border border-green/35 text-green-light px-3 py-1 rounded-full text-xs font-black">
                    <Sparkles size={14} />
                    <span>استشارة تغذوية فورية مجانًا</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    أخصائي التغذية الذكي بالذكاء الاصطناعي 🧠🤖
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    اكتب تفاصيل وزنك، طولك، وهدفك الصحي، وحساسياتك. سيقوم محرك كوتش التغذية الذكي والمبني على نموذج كود Gemini 3.5 بتقدير سعراتك، وتصميم خطة وجبات تناسب وضعك، ويرسم الباقة المناسبة لك للاشتراك فورًا!
                  </p>

                  <form onSubmit={handleAICounselSubmit} className="flex flex-col gap-3.5 mt-2 text-zinc-900">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">الاسم</label>
                        <input
                          type="text"
                          placeholder="مثال: خالد العتيبي"
                          value={aiForm.name}
                          onChange={(e) => setAiForm({ ...aiForm, name: e.target.value })}
                          className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">العمر (بالسنوات) *</label>
                        <input
                          type="number"
                          placeholder="مثال: 28"
                          required
                          value={aiForm.age}
                          onChange={(e) => setAiForm({ ...aiForm, age: e.target.value })}
                          className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">الوزن الحالي (كجم) *</label>
                        <input
                          type="number"
                          placeholder="مثال: 82"
                          required
                          value={aiForm.weight}
                          onChange={(e) => setAiForm({ ...aiForm, weight: e.target.value })}
                          className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">الطول (سم) *</label>
                        <input
                          type="number"
                          placeholder="مثال: 175"
                          required
                          value={aiForm.height}
                          onChange={(e) => setAiForm({ ...aiForm, height: e.target.value })}
                          className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">الهدف الصحي التغذوي الرئيسي *</label>
                      <select
                        value={aiForm.goal}
                        onChange={(e) => setAiForm({ ...aiForm, goal: e.target.value })}
                        className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                      >
                        <option value="فقدان الوزن الزائد ودهون البطن وسرعة الرشاقة">فقدان الوزن والدهون مع زيادة اللياقة</option>
                        <option value="بناء كتلة عضلية صافية وتحسين الأداء والقوة المشبعة بالنيترونات">بناء الكتلة العضلية وتحسين القوة البدنية</option>
                        <option value="الحفاظ على ثبات الوزن وتغذية صحية ممتازة خالية من الخمول">تغذية متوازنة وتثبيت الوزن</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-zinc-300 mb-1 pointer-events-none text-right">أي حساسية طعام تريد تجنبها؟</label>
                      <input
                        type="text"
                        placeholder="مثال: حساسية البيض، الجلوتين، لا سمك..."
                        value={aiForm.allergies}
                        onChange={(e) => setAiForm({ ...aiForm, allergies: e.target.value })}
                        className="w-full bg-white border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={aiCoachLoading}
                      className="w-full bg-amber hover:bg-amber-dark text-black font-black text-sm h-12 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber/20 mt-2 disabled:opacity-50"
                    >
                      {aiCoachLoading ? (
                        <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>احصل على التشخيص الغذائي والتوصية</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Column Results Display */}
                <div className="lg:col-span-7 h-full flex flex-col justify-center min-h-[300px]">
                  {aiCoachLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-8 border border-zinc-700/60 text-center flex flex-col items-center justify-center gap-4 h-full"
                    >
                      <div className="w-14 h-14 rounded-full bg-green/20 text-green flex items-center justify-center animate-bounce">
                        <Sparkles size={24} className="animate-pulse" />
                      </div>
                      <h3 className="text-lg font-black text-white">جاري الاتصال والتشخيص مع أخصائي التغذية...</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                        نقوم الآن بمطابقة تفاصيلك الصحية، وحساب المغذيات الكبرى (البروتين، الكربوهيدرات، الدهون) الموصى بها لمواءمتها مع أفضل قوائم جرين دايت.
                      </p>
                    </motion.div>
                  )}

                  {!aiCoachLoading && !aiResult && !aiError && (
                    <div className="bg-zinc-800/20 border border-dashed border-zinc-700 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
                      <div className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center">
                        <Info size={24} />
                      </div>
                      <h3 className="text-base font-bold text-zinc-300">أدخل عينات قياسك لنرسل التقرير</h3>
                      <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                        عند تحديث البيانات، ستحصل هنا فوراً على معدل السعرات المناسبة، ونسب المغذيات اليومية، وتوصية كبسولية ذكية بأفضل باقة تناسب رغباتك.
                      </p>
                    </div>
                  )}

                  {aiError && (
                    <div className="bg-red-950/20 border border-red-900 border-solid rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3">
                      <span className="text-xl">⚠️</span>
                      <h3 className="text-base font-bold text-red-450">{aiError}</h3>
                      <p className="text-zinc-500 text-xs">يرجى المحاولة مجدداً في وقت لاحق.</p>
                    </div>
                  )}

                  {/* DISPLAY INTELLIGENT RESULTS */}
                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-zinc-800/80 rounded-3xl p-6 border border-zinc-700/80 text-right flex flex-col gap-5 shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-700/60 pb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="text-green" size={18} />
                          <span className="text-sm font-extrabold text-green">تشخيص كوتش التغذية جاهز</span>
                        </div>
                        <span className="text-xs text-zinc-400 font-bold">بناءً على تفضيلاتك</span>
                      </div>

                      {/* Calorie Widget */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center sm:col-span-1">
                          <span className="block text-[10px] text-zinc-400 font-bold mb-1">السعرات المقترحة يومياً</span>
                          <span className="text-2xl font-black text-green-mid tracking-tight">
                            {aiResult.estimatedCalories}
                          </span>
                          <span className="block text-[10px] text-zinc-500">سعرة حرارية / يوم</span>
                        </div>

                        {/* Macros lists */}
                        <div className="sm:col-span-2 flex flex-col gap-2">
                          <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 rounded-xl text-xs">
                            <span className="font-extrabold text-zinc-400">البروتين اليومي:</span>
                            <span className="font-bold text-white transition">{aiResult.macros.protein}</span>
                          </div>
                          <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 rounded-xl text-xs">
                            <span className="font-extrabold text-zinc-400">الكربوهيدرات:</span>
                            <span className="font-bold text-white transition">{aiResult.macros.carbs}</span>
                          </div>
                          <div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 rounded-xl text-xs">
                            <span className="font-extrabold text-zinc-400">الدهون الصحية:</span>
                            <span className="font-bold text-white transition">{aiResult.macros.fats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Coaching text */}
                      <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-900 text-xs flex flex-col gap-1">
                        <span className="font-extrabold text-[#f0b429] flex items-center gap-1">
                          <Leaf size={12} />
                          <span>توجيهات ونصائح الأخصائي الذهبية:</span>
                        </span>
                        <p className="text-zinc-300 leading-relaxed leading-[1.7]">{aiResult.coachingAdvice}</p>
                      </div>

                      {/* Package recommendation integration */}
                      {(() => {
                        const pkg = PRODUCTS.find((p) => p.id === aiResult.recommendedPackageId) || PRODUCTS[8];
                        return (
                          <div className="bg-green-dark/30 hover:bg-green-dark/40 border border-green-mid/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition duration-300 text-right">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 self-start sm:self-center">
                              <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <span className="inline-block bg-[#f0b429] text-black font-black text-[9px] px-2 py-0.5 rounded mb-1">الباقة الموصى بها لك</span>
                              <h4 className="font-black text-sm text-white">{pkg.name}</h4>
                              <p className="text-zinc-300 text-[11px] leading-relaxed mt-1 line-clamp-2">
                                {aiResult.recommendationReason}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <span className="font-black text-white text-sm">{pkg.price} ريال سعودي</span>
                                <button
                                  onClick={() => addToCart(pkg)}
                                  className="bg-green hover:bg-green-dark text-white rounded-lg px-3 py-1 font-extrabold text-xs transition flex items-center gap-1"
                                >
                                  <span>أضف للسلة الآن</span>
                                  <ArrowLeft size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* CATEGORIES FILTERS BAR */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
              <div className="text-center flex flex-col items-center gap-2">
                <span className="text-xs bg-green-light text-green-dark font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  بقايا فئات التغذية
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">اختر نوع باقتك الصحية المفضلة</h2>
                <div className="w-12 h-1 bg-green shadow-xl rounded-full"></div>
              </div>

              {/* Slider list of custom categories */}
              <div className="flex flex-wrap justify-center gap-2 bg-[#e8f7f0]/40 p-1.5 rounded-3xl border border-green-light max-w-3xl mx-auto w-full">
                {[
                  { value: "all", label: "جميع الباقات" },
                  { value: "lunch", label: "باقات الغداء" },
                  { value: "dinner", label: "باقات العشاء" },
                  { value: "snack", label: "سناك صحي" },
                  { value: "weekly", label: "باقات أسبوعية كاملة" }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveCategoryFilter(item.value)}
                    className={`flex-1 min-w-[120px] px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 ${
                      activeCategoryFilter === item.value
                        ? "bg-green text-white shadow-lg shadow-green/20 scale-105"
                        : "text-zinc-600 hover:text-green hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* PRODUCTS GRID SECTION */}
            <section id="store-products" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const isFav = favorites.has(product.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedProductDetail(product)}
                      key={product.id}
                      className="bg-white rounded-[28px] border border-green-light hover:border-green/30 shadow-[0_8px_30px_rgba(26,158,110,0.02)] hover:shadow-2xl hover:shadow-green-950/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                    >
                      <div className="relative h-[200px] bg-zinc-100 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <span
                            className={`absolute top-4 right-4 z-10 px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${product.badgeColor}`}
                          >
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-xl bg-white/80 backdrop-blur text-zinc-600 hover:text-red-500 flex items-center justify-center shadow-lg transition"
                        >
                          <Heart size={16} fill={isFav ? "#ef4444" : "none"} className={isFav ? "text-red-500 scale-110" : ""} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between text-right gap-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
                            {product.category === "lunch"
                              ? "غداء صحي ومغذي"
                              : product.category === "dinner"
                              ? "عشاء خفيف ومريح"
                              : product.category === "snack"
                              ? "سناكس غنية بالطاقة"
                              : "باقة أسبوعية شاملة"}
                          </span>
                          <h3 className="font-extrabold text-[15px] sm:text-base text-zinc-900 group-hover:text-green-dark transition">
                            {product.name}
                          </h3>
                          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{product.desc}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-100/65 pt-4">
                          <div>
                            <span className="block text-xs text-zinc-400 line-through font-bold">{product.oldPrice} ريال</span>
                            <span className="text-lg font-black text-green">{product.price} ريال</span>
                          </div>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-green hover:bg-green-dark text-white rounded-xl h-10 px-4 flex items-center gap-1.5 font-extrabold text-xs transition duration-200"
                          >
                            <Plus size={14} />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="bg-white py-14 border-t border-b border-green-light">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                <div className="text-center flex flex-col items-center gap-2">
                  <span className="text-xs bg-green-light text-green-dark font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    الجودة الفائقة والالتزام
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">لماذا يختار الجميع جرين دايت؟</h2>
                  <div className="w-12 h-1 bg-green shadow-xl rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#fafdf8] rounded-3xl p-6 border border-green-light text-right flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-light text-green flex items-center justify-center shadow-md">
                      <Leaf size={22} />
                    </div>
                    <h3 className="font-black text-lg text-zinc-900">طازج ومحلي يومياً</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      نطهر ونحضر أطعمتنا يومياً في الصباح الباكر بمطبخ الرياض وجدة. لا نستخدم المواد المحفوظة أو المجمدة لضمان احتفاظ الطبق بعناصره الحيوية ومذاقه الرائع الطازج.
                    </p>
                  </div>

                  <div className="bg-[#fafdf8] rounded-3xl p-6 border border-green-light text-right flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-light text-green flex items-center justify-center shadow-md">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="font-black text-lg text-zinc-900">إشراف كوتش معتمد</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      باقاتنا لا تُعبر عن طبخ كلاسيكي؛ بل هي صياغات علمية دقيقة تم تصميمها واعتمادها من قِبل نخبة من أخصائيي التغذية من الهيئة السعودية للتخصصات لتسريع عافيتك.
                    </p>
                  </div>

                  <div className="bg-[#fafdf8] rounded-3xl p-6 border border-green-light text-right flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-light text-green flex items-center justify-center shadow-md">
                      <Truck size={22} />
                    </div>
                    <h3 className="font-black text-lg text-zinc-900">سلاسل لوجستية مبردة</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      تنتقل كل باقة في حقائب حرارية وبواسطة أسطول توصيل خاص تحت نظام تبريد دائم لضمان الاستلام بأعلى المقاييس الصحية وبطريقة لبقة وفي الوقت المطلوب.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
              <div className="text-center flex flex-col items-center gap-2">
                <span className="text-xs bg-green-light text-green-dark font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  آراء وتجارب
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">ماذا يقول أبطال الرشاقة عنا؟</h2>
                <div className="w-12 h-1 bg-green shadow-xl rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    name: "م. عبدالرحمن الشمري",
                    role: "مهندس، الرياض",
                    body: "نظام كيتو الموزون عندهم أحدث فارق هائل في صفاء ذهني وأدائي المهني، وخسرت أكثر من ٩ كيلو من وزني الزائد بسهولة وبدون أي قيود أو تعب طوال شهرين مستمرة.",
                    stars: "★★★★★"
                  },
                  {
                    name: "د. هند الدوسري",
                    role: "طبيبة، جدة",
                    body: "توصيل الباقات اليومي خفّض إهدار وقتي وحل مشكلة طبخي بالكامل. الوجبات نظيفة للغاية، طازجة ومقاديرها واضحة ومدروسة السعرات بصورة دقيقة جداً ومدهشة.",
                    stars: "★★★★★"
                  },
                  {
                    name: "فيصل العتيبي",
                    role: "رياضي كمال أجسام",
                    body: "تغطية ممتازة من البروتينات بوزن مضبوط وعناية قصوى. باقة الأسبوع الشاملة كانت رفيقي الأساسي للوصول بنسب دهون بطني لحدود ٩٪. خدمة عملاء راقية.",
                    stars: "★★★★★"
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-3xl p-6 border border-green-light text-right flex flex-col gap-4 shadow-sm hover:shadow-md transition">
                    <span className="text-accent text-sm font-bold tracking-wider">{item.stars}</span>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed italic">
                      &quot; {item.body} &quot;
                    </p>
                    <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                        {item.name.substring(0, 2)}
                      </div>
                      <div>
                        <span className="block text-sm font-black text-zinc-950">{item.name}</span>
                        <span className="text-[10px] text-zinc-400 font-extrabold">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ABOUT DETAILED TAB */}
        {activeTab === "about" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col gap-16 text-right">
            
            {/* Header story */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6 items-start text-right">
                <span className="inline-block bg-green-light text-green-dark px-3.5 py-1.5 rounded-full text-xs font-black">
                  مهمتنا وقيمنا الكلية
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-tight">
                  بدأنا بشغف بسيط:
                  <span className="block text-green">تبسيط ونشر نمط الحياة الصحي</span>
                </h2>
                <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
                  تأسست جرين دايت عام ٢٠٢٢ في الرياض كاستجابة طبيعية للحاجة المتزايدة لنهج غذائي آمن وطازج يتناسب مع إيقاع الحياة الحديث المتسارع في السعودية. لا نؤمن بالحميات المؤقتة بل بالدايت اللذيذ المستمر في بيئة مبهجة.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-zinc-100/50 p-4 rounded-2xl border border-zinc-200/50">
                    <span className="block text-xl font-black text-green">+8000</span>
                    <span className="text-xs text-zinc-400 font-bold">باقة نشطة شهريًا</span>
                  </div>
                  <div className="bg-zinc-100/50 p-4 rounded-2xl border border-zinc-200/50">
                    <span className="block text-xl font-black text-green">100%</span>
                    <span className="text-xs text-zinc-400 font-bold">منتجات طبيعية ومحلية</span>
                  </div>
                </div>
              </div>

              <div className="relative h-[250px] sm:h-[400px] rounded-3xl overflow-hidden border border-green-light shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80"
                  alt="من نحن"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>

            {/* TIMELINE TIMELINE SECTION */}
            <section className="flex flex-col gap-8">
              <div className="text-right">
                <h3 className="text-2xl font-black text-zinc-950">محطات ذهبية من رحلتنا</h3>
                <span className="text-xs text-zinc-400 font-bold">قصة عطاء ونمو مستمر</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {[
                  {
                    year: "٢٠٢٢",
                    title: "تأسيس الحلم الغذائي",
                    desc: "انطلقنا من مطبخ صغير بالرياض مع طاقم خبراء لتأمين ٥٠ وجبة دايت صحية بالدقيقة الأولى."
                  },
                  {
                    year: "٢٠٢٣",
                    title: "التوسع للساحل الغربي",
                    desc: "افتتحنا خطوط إنتاج وتبريد مخصصة لمدينة جدة ومكة استجابة لثقة عملائنا الأوفياء."
                  },
                  {
                    year: "٢٠٢٤",
                    title: "الجائزة الوطنية للغذاء",
                    desc: "حصدنا لقب أفضل متجر وباقات توصيل صحية مبتكرة من الاتحاد الوطني لتجارة الأقوات."
                  },
                  {
                    year: "اليوم والـمستقبل",
                    title: "الذكاء الاصطناعي والتخصيص",
                    desc: "ندمج اليوم تقنيات حسابات المغذيات مع خدمات التوصيل لتصميم أسلوب ونمط حياة مخصص ومثالي."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-green-light shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-green transition">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-green-light group-hover:bg-green transition"></div>
                    <span className="text-2xl font-black text-green-dark">{item.year}</span>
                    <h4 className="font-extrabold text-sm text-zinc-900">{item.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CERTIFICATES */}
            <section className="bg-green-light/45 rounded-3xl p-8 border border-green-light flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-green-dark">جهة ومؤسسة صحية مرخصة ومعتمدة بالكامل</h3>
                <p className="text-zinc-650 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
                  نحن نتبع أعلى معايير السلامة والتنظيم الغذائي للمنشآت في السعودية، وحاصلون على شهادات الفحص والترخيص من هيئة الغذاء والدواء السعودية (SFDA) ووزارة الصحة، لنضمن غذاء نظيفاً معتمداً.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white border text-green-dark font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider">
                  الغذاء والدواء SFDA
                </span>
                <span className="bg-white border text-green-dark font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider">
                  ISO 22000
                </span>
              </div>
            </section>

          </div>
        )}

        {/* SHIPPING SHIPPING GUIDE TAB */}
        {activeTab === "shipping" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col gap-12 text-right">
            
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="inline-block bg-green-light text-green-dark px-3.5 py-1.5 rounded-full text-xs font-black">
                سياسات التوصيل الجغرافي
              </span>
              <h2 className="text-3xl font-black text-zinc-900">نصل طازجاً، لباب بيتك بكل دقة</h2>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                ندرك في جرين دايت أن صحة الوجبة تبدأ من جودة نقلها للمستهلك. صممنا سلاسل توزيع بموجب تبريد مضغوط يحمي وجبتك من التلف ويحافظ على العناصر المعدنية الحية بالطبق لنصلك براحة فائقة.
              </p>
            </div>

            {/* Coverage cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  city: "الرياض الكبرى ومحيطها",
                  hours: "التوصيل من ٧ صباحًا لـ ١١ مساءً",
                  fee: "توصيل عادي: ١٥ ريال (مجاني للاشتراكات)",
                  details: "الطلبات قبل الظهر تسلم بنفس المساء"
                },
                {
                  city: "جدة ومراكز الساحل الرئيسي",
                  hours: "التوصيل من ٨ صباحًا لـ ١٠ مساءً",
                  fee: "توصيل عادي: ٢٠ ريال (مجاني فوق ٢٠0 ريال)",
                  details: "حفظ طبي كامل في صناديق باردة مجمدة"
                },
                {
                  city: "المنطقة الشرقية والدمام والخبر",
                  hours: "التوصيل من ٨ صباحًا لـ ١٠ مساءً",
                  fee: "توصيل عادي: ٢٠ ريال (مجاني فوق ٢00 ريال)",
                  details: "ساعات تسليم ليلية للموظفين لغداء الغد"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-green-light shadow-sm text-right flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-light text-green flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <h4 className="font-black text-base text-zinc-900">{item.city}</h4>
                  <p className="text-green-dark text-xs font-bold">{item.hours}</p>
                  <p className="text-zinc-650 text-xs">{item.fee}</p>
                  <p className="text-zinc-400 text-[10px] font-semibold">{item.details}</p>
                </div>
              ))}
            </div>

            {/* Price Table */}
            <div className="border border-green-light rounded-3xl overflow-hidden bg-white shadow-xl">
              <div className="bg-green-dark text-white p-4 font-black text-xs sm:text-sm grid grid-cols-4 text-center">
                <span>فئة ونوع التوصيل</span>
                <span>المدة المستغرقة</span>
                <span>الرسوم الافتراضية</span>
                <span>شرط الإعفاء والمجانية</span>
              </div>
              {[
                { type: "توصيل باقات غداء / عشاء", time: "يومياً ضمن الشريحة", fee: "١٥ ريال", free: "بالمجان لكل المشتركين 🎉" },
                { type: "توصيل السلة الفردي (الرياض)", time: "٢-٤ ساعات", fee: "١٥ ريال", free: "مجاني للمشتريات فوق ٢٠٠ ريال" },
                { type: "التوصيل السريع الطارئ (خيار مخصص)", time: "خلال ساعتين فقط", fee: "٤٠ ريال", free: "غير شامل للمجانية" }
              ].map((row, idx) => (
                <div key={idx} className="p-4 grid grid-cols-4 text-center items-center border-b border-zinc-100 last:border-b-0 text-xs">
                  <span className="font-extrabold text-zinc-900">{row.type}</span>
                  <span className="text-zinc-500">{row.time}</span>
                  <span className="font-bold text-green">{row.fee}</span>
                  <span className="font-bold text-zinc-800">{row.free}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* RETURNS & COMPLIANCE TAB */}
        {activeTab === "returns" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col gap-12 text-right">
            
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="inline-block bg-green-light text-green-dark px-3.5 py-1.5 rounded-full text-xs font-black">
                ضمان الاسترداد والرضا
              </span>
              <h2 className="text-3xl font-black text-zinc-900">ضمان عافية وجودة ١٠٠٪ بدون شروط</h2>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                رضاك وعافيتك مصلحتنا العليا. نحن نثق تمام الثقة بما نطهوه ونقدمه لك؛ ولكن في حال عدم مطابقة طبقنا لتوقعاتك ومواصفات جودتك العالية، نتعهد فورًا برد المبالغ بكل تفرّد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Box 1 Allows */}
              <div className="bg-[#f0fbf6] rounded-3xl p-6 border border-green-light text-right flex flex-col gap-4">
                <span className="text-xl font-bold text-green">✓ الحالات التي يحق لك فيها طلب استرداد مالي كامل</span>
                <ul className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-650 list-none">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green"></span>
                    <span>وصول وجبتك بعبوة تالفة أو مفتوحة مسبقاً تؤثر على سلامتها ونظافتها.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green"></span>
                    <span>عدم مطابقة محتوى الطبق أو الباقة للوصف والخصائص والمقادير المطلوبة.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green"></span>
                    <span>تأخر المندوب في التوصيل لعنوانك لأكثر من ساعتين عن ميعاد الفئة الزمنية المحددة.</span>
                  </li>
                </ul>
              </div>

              {/* Box 2 Restricts */}
              <div className="bg-red-50/50 rounded-3xl p-6 border border-red-200 text-right flex flex-col gap-4">
                <span className="text-xl font-bold text-red-500">✗ الحالات التي يتعذر فيها قبول الاسترجاع</span>
                <ul className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-650 list-none">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>أسباب تتعلق بذوقك وتفضيلك الشخصي لطعم بهار معين بعد فتح العلبة وتناولها.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>تغيير قرارك الشخصي وإظهار الرغبة بالإلغاء بعد استلام المندوب للطبق وخروجه بالسيارة.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>مرور فترة تزيد عن ساعتين على استلامك للوجبة دون التبليغ وتصوير العيب المرفق.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Protocol Steps */}
            <div className="bg-zinc-900 text-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { step: "١", name: "أرسل لخدمتنا", text: "تواصل مع واتساب الدعم خلال ساعتين من استلامك الوجبة" },
                { step: "٢", name: "التقط صورة", text: "قم بتصوير التلف أو العيب الحاصل للعبوة مع رقم الفاتورة" },
                { step: "٣", name: "المطابقة ومراجعة الطلب", text: "سيدرس فريقنا طلبك ويُطبقه خلال حد أقصى ٣٠ دقيقة فقط" },
                { step: "٤", name: "رد الأموال بالكامل", text: "نعيد لك أموالك فوري لحسابك البنكي أو بطاقتك" }
              ].map((prot, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green text-zinc-900 flex items-center justify-center font-black text-lg">
                    {prot.step}
                  </div>
                  <h5 className="font-extrabold text-sm text-white">{prot.name}</h5>
                  <p className="text-zinc-400 text-xs leading-relaxed">{prot.text}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* FAQS DETAILED ACCORDION TAB */}
        {activeTab === "faq" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col gap-8 text-right">
            
            <div className="text-center flex flex-col items-center gap-2">
              <span className="text-xs bg-green-light text-green-dark font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                الدعم والمعرفة الشاملة
              </span>
              <h2 className="text-3xl font-black text-zinc-900">هل لديك سؤال يشغل تفكيرك؟</h2>
              <p className="text-zinc-500 text-xs sm:text-sm">ابحث في قوائم أسئلتنا الشائعة المحدثة باستمرار للعملاء</p>
            </div>

            {/* Search inputs */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالكلمات المفتاحية... (مثل: كيتو، دجاج، توصيل، تابي)"
                value={faqSearch === " " ? "" : faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-white border-2 border-green-light rounded-3xl py-4 pr-12 pl-4 text-sm focus:outline-none focus:border-green text-right"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            </div>

            {/* categories filter tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {FAQ_CATEGORIES.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFaqCat(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
                    faqCat === tab.id ? "bg-green text-white" : "bg-green-light/35 text-zinc-700 hover:bg-green-light/65"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* list accordions */}
            <div className="flex flex-col gap-3">
              {filteredFAQs.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-3xl border border-dashed text-zinc-400 font-bold">
                  لم نجد أسئلة تطابق بحثك... جرب استخدام كلمات أخرى أو راسلنا !
                </div>
              ) : (
                filteredFAQs.map((faq, index) => {
                  const isOpen = expandedFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-green-light overflow-hidden transition"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                        className="w-full text-right p-5 font-black text-sm flex items-center justify-between gap-4 select-none hover:bg-zinc-50"
                      >
                        <span className="text-zinc-900">{faq.q}</span>
                        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-zinc-50/65 px-5 pb-5 pt-1 text-zinc-650 text-xs sm:text-sm leading-relaxed border-t border-zinc-100"
                          >
                            <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* CONTACT & BUSINESS FORM TAB */}
        {activeTab === "contact" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col gap-16 text-right">
            
            <div className="text-center flex flex-col items-center gap-2">
              <span className="text-xs bg-green-light text-green-dark font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                الدعم والشراكات
              </span>
              <h2 className="text-3xl font-black text-zinc-900">تواصل مع عائلة جرين دايت</h2>
              <p className="text-zinc-500 text-xs sm:text-sm">سواء للاقتراحات الفردية أو باقات الشركات وتوريد الجملة بمواصفات White Label</p>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Form Input Deck */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[36px] border border-green-light shadow-xl text-right">
                
                {contactSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center flex flex-col items-center justify-center gap-4 py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-light text-green flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-green-dark">تم استلام مراسلتك بنجاح!</h3>
                    <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed max-w-sm">
                      شكراً لتواصلك مع جرين دايت. سنقوم الآن بتدبيج طلبك وتحويله للقسم المختص؛ وسيتم الرد عليك في غضون ساعة كحد أقصى خلال ساعات العمل المعتمدة.
                    </p>
                    <button
                      onClick={() => {
                        setContactSuccess(false);
                        setContactForm({ name: "", phone: "", email: "", type: "استفسار عن المنتجات والباقات", orderId: "", message: "" });
                      }}
                      className="bg-green hover:bg-green-dark text-white rounded-2xl h-11 px-6 font-bold text-xs"
                    >
                      إرسال تذكرة تواصل أخرى
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                    <h3 className="text-xl font-black text-zinc-950">أرسل لنا رسالة تظليل</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-650 mb-1">الاسم الكامل *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                          placeholder="مثال: فيصل العتيبي"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-650 mb-1">رقم الجوال النشط *</label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                          placeholder="مثال: 0500000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-650 mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        placeholder="example@mail.sa"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-650 mb-1">نوع المراسلة *</label>
                        <select
                          value={contactForm.type}
                          onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                          className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        >
                          <option>استفسار عن المنتجات والباقات</option>
                          <option>طلب تعويض أو استرداد مالي</option>
                          <option>شراكة تجارية أو توريد مأكولات</option>
                          <option>اقتراحات أو شكاوى كادر الخدمة</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-650 mb-1">رقم الفاتورة أو الطلب (اختياري)</label>
                        <input
                          type="text"
                          value={contactForm.orderId}
                          onChange={(e) => setContactForm({ ...contactForm, orderId: e.target.value })}
                          className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                          placeholder="مثال: GD-25418"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-650 mb-1">رسالتك بالتفصيل *</label>
                      <textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={5}
                        className="w-full bg-[#fafdf8] border border-green-light rounded-xl p-3 text-sm focus:outline-none focus:border-green"
                        placeholder="كيف نقدر نساعدك اليوم؟ يرجى كتابة التفاصيل هنا."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContact}
                      className="bg-green hover:bg-green-dark text-white font-black text-sm h-12 rounded-xl transition disabled:opacity-50"
                    >
                      {submittingContact ? "جاري الإرسال للتوطين..." : "إرسال رسالة الدعم"}
                    </button>
                  </form>
                )}
              </div>

              {/* Physical details info deck */}
              <div className="lg:col-span-5 flex flex-col gap-6 text-right text-zinc-700">
                <div className="bg-green-light/35 p-6 rounded-3xl border border-green-light">
                  <h4 className="font-black text-lg text-green-dark mb-4">قنوات ومعلومات المراسلة المعتمدة</h4>
                  <div className="flex flex-col gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-3.5 bg-white/70 p-3.5 rounded-2xl border border-green-light/40 hover:bg-white transition duration-300 shadow-sm shadow-green-950/5">
                      <div className="w-10 h-10 rounded-xl bg-green-light text-green flex items-center justify-center flex-shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="block text-zinc-400 font-bold text-[10px]">الهاتف الموحد بالسعودية:</span>
                        <span className="font-extrabold text-zinc-900 text-sm sm:text-base">٩٢٠٠١٤٥٠٢ (مجاني)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/70 p-3.5 rounded-2xl border border-green-light/40 hover:bg-white transition duration-300 shadow-sm shadow-green-950/5">
                      <div className="w-10 h-10 rounded-xl bg-green-light text-green flex items-center justify-center flex-shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="block text-zinc-400 font-bold text-[10px]">البريد الإلكتروني للشركاء:</span>
                        <span className="font-extrabold text-zinc-900 text-sm sm:text-base">info@greendiet.sa</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/70 p-3.5 rounded-2xl border border-green-light/40 hover:bg-white transition duration-300 shadow-sm shadow-green-950/5">
                      <div className="w-10 h-10 rounded-xl bg-green-light text-green flex items-center justify-center flex-shrink-0">
                        <Clock size={18} />
                      </div>
                      <div>
                        <span className="block text-zinc-400 font-bold text-[10px]">ساعات الدعم والإدارة:</span>
                        <span className="font-extrabold text-[#1a9e6e] text-xs sm:text-sm">السبت إلى الخميس: من ٨ ص وحتى ١٠ م</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 text-right flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-light/20 text-green flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <h4 className="font-black text-sm text-white">باقات الأعمال وتوريد الجملة (B2B)</h4>
                  <p className="text-zinc-450 text-[11px] leading-relaxed">
                    هل تمتلكون كافيه، أو نادي رياضي، أو مطعم صحي في السعودية وتريدون توريد حلول وجبات معبأة طازجة يومياً بشعار علامتكم التجارية أو شعار جرين دايت؟ نوفر أسعار مخصصة للشركات والمؤسسات.
                  </p>
                  <a
                    href="mailto:info@greendiet.sa"
                    className="inline-block self-start text-xs font-black text-[#f0b429] hover:underline"
                  >
                    تواصل معنا لتلقي عرض الأسعار والمواصفات ←
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* FOOTER GENERAL */}
      <footer className="bg-zinc-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          <div className="flex flex-col gap-5">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="لوجو جرين دايت"
                width={112}
                height={36}
                className="h-9 w-auto object-contain brightness-0 invert opacity-75 hover:opacity-100 transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              جرين دايت هو شريك عافيتك وصحتك المثالي في المملكة العربية السعودية. نوصّل الأكل طازجاً، صحياً، وموزون المقادير بكل رقي.
            </p>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-zinc-500 block">سجل تجاري سعودي معتمد: ١٠١٠٦٨٥٤</span>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-2.5 mt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-green hover:border-green hover:bg-green-dark/10 transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-green hover:border-green hover:bg-green-dark/10 transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 shadow-sm"
                  aria-label="Twitter / X"
                >
                  <Twitter size={14} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-green hover:border-green hover:bg-green-dark/10 transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-green hover:border-green hover:bg-green-dark/10 transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-black text-[#f0b429] uppercase tracking-wider">روابط سريعة</span>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <button onClick={() => setActiveTab("home")} className="text-right hover:text-green transition">الرئيسية والمـتجر</button>
              <button onClick={() => setActiveTab("about")} className="text-right hover:text-green transition">من نحنُ وقصتنا</button>
              <button onClick={() => setActiveTab("shipping")} className="text-right hover:text-green transition">سياسات التغطية والشحن</button>
              <button onClick={() => setActiveTab("faq")} className="text-right hover:text-green transition">الأسئلة والمركز المعرفي</button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-black text-[#f0b429] uppercase tracking-wider">سياساتنا الحكيمة</span>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <button onClick={() => setActiveTab("returns")} className="text-right hover:text-green transition">سياسة الإرجاع والضمان</button>
              <button onClick={() => setActiveTab("contact")} className="text-right hover:text-green transition">طلب باقات الجملة للشركات</button>
              <span className="text-right">سياسة الخصوصية وسرية القياس</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-black text-[#f0b429] uppercase tracking-wider">تواصل آمن ومستمر</span>
            <p className="text-zinc-400 text-xs leading-relaxed">
              طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية.
            </p>
            <span className="text-xs font-extrabold text-green shadow-sm">دعم فني: info@greendiet.sa</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>حقوق الطبع محفوظة لشركة جرين دايت © ٢٠٢٦ – عافية مستدامة وصحة فائقة.</span>
          <span>صُنع بحب في السعودية وفخر واعتزاز للسوق السعودي 🇸🇦</span>
        </div>
      </footer>

      {/* PERSISTENT MOBILE CTA NAVIGATION BAR ON SCREEN BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-3 flex sm:hidden justify-between items-center z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition ${activeTab === "home" ? "text-green" : "text-zinc-400"}`}
        >
          <Leaf size={18} />
          <span className="text-[10px] font-bold">الباقات</span>
        </button>
        <button
          onClick={() => {
            const el = document.getElementById("ai-coach-section");
            el?.scrollIntoView({ behavior: "smooth" });
            setActiveTab("home");
          }}
          className="flex-1 flex flex-col items-center gap-1 py-1.5 text-zinc-400 hover:text-green"
        >
          <Sparkles size={18} />
          <span className="text-[10px] font-bold">الذكاء</span>
        </button>
        <button
          onClick={() => {
            setCartOpen(true);
          }}
          className="flex-1 flex flex-col items-center gap-1 py-1.5 text-green-dark relative"
        >
          <ShoppingCart size={18} />
          <span className="text-[10px] font-bold">السلة</span>
          <span className="absolute -top-1 right-8 w-4 h-4 rounded-full bg-accent text-zinc-950 flex items-center justify-center text-[9px] font-black">
            {cart.reduce((s, z) => s + z.qty, 0)}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition ${activeTab === "contact" ? "text-green" : "text-zinc-400"}`}
        >
          <MessageSquare size={18} />
          <span className="text-[10px] font-bold">واتساب</span>
        </button>
      </div>

      {/* SHOPPING CART SIDECAB DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex justify-start"
            onClick={() => setCartOpen(false)}
          >
            {/* Sliding cabinet layout */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col text-right"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-green" size={20} />
                  <span className="font-black text-base text-zinc-950">سلتك الصحية الخاصة</span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-9 h-9 rounded-xl bg-zinc-100 test-zinc-650 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer body scroll */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-green-light text-green flex items-center justify-center">
                      <ShoppingCart size={22} />
                    </div>
                    <h4 className="font-extrabold text-sm text-zinc-900">سلتك فارغة تماماً الآن</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                      أضف باقات الوجبات المناسبة لك أو استخدم كوتش التغذية الذكي بالذكاء الاصطناعي لاختيار باقة مخصصة تناسب رغباتك ووزنك!
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-[#fafdf8] rounded-2xl p-4 border border-green-light/80 flex items-center gap-4 relative">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 truncate">{item.name}</h4>
                        <span className="block text-xs font-black text-green mt-1">{item.price} ريال سعودي</span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white border border-green-light text-zinc-600 flex items-center justify-center"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-bold text-zinc-800">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white border border-green-light text-zinc-600 flex items-center justify-center"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-4 left-4 text-zinc-400 hover:text-red-500 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Delivery meter calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/65 flex flex-col gap-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/60 flex items-center gap-3">
                    <div className="bg-green-light text-green p-1.5 rounded-xl">
                      <Truck size={14} />
                    </div>
                    <div className="flex-1">
                      {isFreeDelivery ? (
                        <span className="block text-xs font-black text-green-dark">مبارك! لقد حصلت على توصيل مجاني لموقعك 🚚</span>
                      ) : (
                        <div className="text-xs">
                          <span className="block text-zinc-500">متبقي لك</span>
                          <span className="font-black text-green-dark">{200 - cartSubtotal} ريال</span>
                          <span className="text-zinc-500">للحصول على الشحن والتوصيل المجاني بالكامل!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>إجمالي سلة المنتجات:</span>
                      <span className="font-bold text-zinc-800">{cartSubtotal} ريال</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>رسوم التوصيل لعنوانك:</span>
                      <span className="font-bold text-zinc-800">{deliveryFee === 0 ? "مجاني" : `${deliveryFee} ريال`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-950 font-black border-t border-zinc-200/60 pt-2.5">
                      <span>الجميل الإجمالي الشامل:</span>
                      <span className="text-green-dark">{cartTotal} ريال سعودي</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("تم إرسال طلبك للتوطين والدفع الفوري! شكراً لتسوقك.");
                      setCart([]);
                      localStorage.removeItem("gd_cart");
                      setCartOpen(false);
                    }}
                    className="w-full bg-green hover:bg-green-dark text-white rounded-2xl h-12 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green/20"
                  >
                    <span>الدفع المباشر والآمن بالمنصة</span>
                    <ArrowLeft size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL POPUP */}
      <AnimatePresence>
        {selectedProductDetail && (
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedProductDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 overflow-hidden border border-green-light max-h-[90vh] overflow-y-auto flex flex-col gap-6 text-right relative"
            >
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-zinc-100 text-zinc-500 hover:text-zinc-950 flex items-center justify-center z-10 transition"
              >
                <X size={18} />
              </button>

              <div className="relative h-[220px] sm:h-[280px] rounded-2xl overflow-hidden border border-zinc-150">
                <Image
                  src={selectedProductDetail.image}
                  alt={selectedProductDetail.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs bg-green-light self-start text-green px-3 py-1 rounded-lg font-bold">
                    باقة جرين دايت المختارة
                  </span>
                  <h3 className="text-2xl font-black text-zinc-950">{selectedProductDetail.name}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{selectedProductDetail.desc}</p>
                </div>

                {/* Ingredients and list items */}
                <div>
                  <h4 className="font-black text-sm text-zinc-900 mb-2">المحتويات والمكونات الأساسية للطبق اليومي:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductDetail.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-sm text-zinc-900 mb-2">أولى الفوائد التغذوية والصحية للبدء:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-650">
                    {selectedProductDetail.benefits.map((ben, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green flex-shrink-0" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 pt-6 mt-2">
                  <div>
                    <span className="block text-zinc-400 font-bold text-xs">قيمة الاشتراك الكامل شاملة الضريبة:</span>
                    <span className="text-2xl font-black text-green-dark">{selectedProductDetail.price} ريال سعودي</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProductDetail);
                      setSelectedProductDetail(null);
                    }}
                    className="bg-green hover:bg-green-dark text-white rounded-2xl h-12 px-6 font-black text-sm transition"
                  >
                    تأكيد الشراء والإضافة للسلة
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
