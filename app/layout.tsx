import type {Metadata} from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css'; // Global styles

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'جرين دايت – Green Diet | متجر الوجبات والاشتراكات الصحية',
  description: 'جرين دايت هو متجرك الأول للوجبات والاشتراكات الصحية في المملكة العربية السعودية. باقات غداء، عشاء، وسناك طازجة يومياً تحت إشراف أخصائيين معتمدين.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable}`}>
      <body suppressHydrationWarning className="font-sans bg-[#fafdf8] text-[#1a1a2e] antialiased">
        {children}
      </body>
    </html>
  );
}
