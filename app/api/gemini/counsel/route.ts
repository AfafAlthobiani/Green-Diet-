import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Lazy initialization of the GoogleGenAI client to prevent build-time crashes if GEMINI_API_KEY is not set.
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("مفتاح API الخاص بـ Gemini (GEMINI_API_KEY) غير معرّف. يرجى إضافة GEMINI_API_KEY في إعدادات البيئة (Environment Variables) الخاصة بمشروعك على Vercel أو الخادم.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { name, weight, height, age, goal, activity, allergies, preferredCategories } = await req.json();

    if (!weight || !height || !age || !goal) {
      return NextResponse.json({ error: "الرجاء توفير جميع البيانات الأساسية: الوزن، الطول، العمر، والهدف." }, { status: 400 });
    }

    // Initialize the AI client lazily
    const ai = getAiClient();

    const prompt = `
      بصفتك أخصائي تغذية معتمد في المملكة العربية السعودية لشركة "جرين دايت" (Green Diet)، قم بإنشاء خطة غذائية استشارية ذكية وملهمة للعميل التالي:
      - الاسم: ${name || "عميلنا الكريم"}
      - الوزن: ${weight} كجم
      - الطول: ${height} سم
      - العمر: ${age} سنة
      - الهدف الصحي: ${goal}
      - مستوى النشاط البدني: ${activity}
      - أي حساسية طعام أو استثناءات: ${allergies || "لا يوجد"}
      - تفضيل الوجبات: ${preferredCategories?.join("، ") || "الكل"}

      الباقات المتاحة لدينا في "جرين دايت" هي:
      1. باقة غداء صحي – 3 أيام (المعرف: 1)
      2. باقة غداء صحي – 5 أيام (المعرف: 2)
      3. باقة غداء صحي – 7 أيام (المعرف: 3)
      4. باقة عشاء صحي – 3 أيام (المعرف: 4)
      5. باقة عشاء صحي – 5 أيام (المعرف: 5)
      6. باقة عشاء صحي – 7 أيام (المعرف: 6)
      7. باقة سناك صحي – 5 أيام (المعرف: 7)
      8. باقة سناك صحي – 7 أيام (المعرف: 8)
      9. باقة الأسبوع الكامل الصحي (غداء + عشاء + سناك لـ7 أيام) (المعرف: 9)
      10. باقة الكيتو الأسبوعية (المعرف: 10)
      11. باقة نباتية أسبوعية (المعرف: 11)
      12. باقة العائلة الأسبوعية (المعرف: 12)

      تأكد من اختيار الباقة الأكثر ملاءمة لأهدافه ومحاذير الحساسية لديه بدقة، وقدم نصائح تساهم في نجاح خطته الصحية بأسلوب مبهج وودي ومشجع باللغة العربية مع مراعاة العادات التغذوية في السعودية.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت أخصائي ومستشار تغذية خبير وودود، وممثلاً رسمياً لشركة جرين دايت للوجبات الصحية في السعودية. تتحدث بلهجة راقية ومحفزة للغاية، وتجيد حسابات السعرات الحرارية والمغذيات الدقيقة ومواءمة الباقات المناسبة لعملائك.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedCalories: {
              type: Type.NUMBER,
              description: "السعرات الحرارية اليومية المستهدفة والمقدرة بدقة بناءً على معادلات الوزن والطول والنشاط وبما يتوافق مع الهدف."
            },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING, description: "كمية البروتين اليومية الموصى بها بالجرام مع دورها" },
                carbs: { type: Type.STRING, description: "كمية الكربوهيدرات اليومية الموصى بها بالجرام مع دورها" },
                fats: { type: Type.STRING, description: "كمية الدهون الصحية اليومية الموصى بها بالجرام مع دورها" }
              },
              required: ["protein", "carbs", "fats"]
            },
            coachingAdvice: {
              type: Type.STRING,
              description: "أقوى ثلاث نصائح ذهبية ومخصصة جداً لأهدافه من أخصائي التغذية للالتزام والتحفيز بأسلوب فخم باللغة العربية."
            },
            recommendedPackageId: {
              type: Type.INTEGER,
              description: "رقم باقة جرين دايت الأكثر ملاءمة لملفه من (1 إلى 12). إذا طلب كيتو اختر 10، وإذا كان نباتياً اختر 11، وإذا كان يريد تغطية كاملة وشاملة بفاعلية عالية اختر 9."
            },
            recommendationReason: {
              type: Type.STRING,
              description: "تفسير مفصل ومشجع للغاية للعميل يربط بين اختيار هذه الباقة تحديدا وبين تحقيق هدفه مع مراعاة الحساسية المكتوبة."
            }
          },
          required: ["estimatedCalories", "macros", "coachingAdvice", "recommendedPackageId", "recommendationReason"]
        }
      }
    });

    const outputText = response.text || "{}";
    return new NextResponse(outputText, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Gemini Counsel Error: ", error);
    return NextResponse.json({
      error: "حدث خطأ أثناء التواصل مع مستشار التغذية الذكي. يرجى المحاولة في وقت لاحق.",
      details: error.message
    }, { status: 500 });
  }
}
