const mongoose = require('mongoose');
const Article = require('./models/Article');
require('dotenv').config();

const dummyArticles = [
  {
    titleEn: 'NUTD Announces Partnership with Global Brands',
    titleAr: 'نماء المتحدة تعلن شراكة مع علامات تجارية عالمية',
    slug: 'nutd-global-partnership-2',
    excerptEn: 'We are thrilled to announce a ground-breaking partnership bringing leading automotive part brands into our catalog.',
    excerptAr: 'نحن فخورون بالإعلان عن شراكة متميزة لجلب كبرى العلامات التجارية لقطع غيار السيارات إلى كتالوجنا.',
    contentEn: '<h1>Global Partnership</h1><p>This is a major step forward for NUTD in the Egyptian market. We are partnering with NGK, Bosch, and Valvoline to distribute their goods directly.</p>',
    contentAr: '<h1 style="text-align:right">شراكة عالمية</h1><p style="text-align:right">تعتبر هذه الشراكة خطوة هامة في السوق المصري لشركة نماء المتحدة بالتعاون مع كبرى الشركات المصنعة.</p>',
    category: 'News',
    thumbnail: 'https://images.unsplash.com/photo-1503376762361-b58611130dcf?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
    views: 1205
  },
  {
    titleEn: 'Autotech 2026 Exhibition Preparation',
    titleAr: 'التجهيز لمعرض أوتوتيك 2026',
    slug: 'autotech-2026-exhibition-2',
    excerptEn: 'Join us at the Cairo International Convention Centre for the biggest auto parts exhibition in Africa.',
    excerptAr: 'انضم إلينا في مركز القاهرة الدولي للمؤتمرات لأكبر معرض لقطع الغيار في أفريقيا.',
    contentEn: '<h2>Autotech 2026</h2><p>Come visit the NUTD booth at Autotech 2026. We will be showcasing our newest distribution networks.</p>',
    contentAr: '<h2 style="text-align:right">أوتوتيك 2026</h2><p style="text-align:right">زوروا جناح نماء المتحدة في معرض أوتوتيك لتشاهدوا أحدث الحلول والمنتجات.</p>',
    category: 'Events',
    thumbnail: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
    views: 890
  },
  {
    titleEn: 'Summer Campaign for Oil Changes',
    titleAr: 'حملة الصيف لتغيير الزيوت',
    slug: 'summer-oil-campaign-2',
    excerptEn: 'Special promotions for all authorized dealers to boost summer oil sales.',
    excerptAr: 'عروض خاصة لجميع الموزعين المعتمدين لزيادة مبيعات زيوت المحركات في فصل الصيف.',
    contentEn: '<h2>Summer Offer</h2><p>Get 15% extra margin when you order synthetic oil bundles this July.</p>',
    contentAr: '<h2 style="text-align:right">عرض الصيف</h2><p style="text-align:right">احصل على هامش ربح إضافي بنسبة 15% عند طلب باقات زيوت المحركات التخليقية خلال شهر يوليو.</p>',
    category: 'Campaigns',
    thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200', 
    isPublished: true,
    views: 350
  },
  {
    titleEn: 'Visit to Delta Region Dealers',
    titleAr: 'زيارة لموزعي منطقة الدلتا',
    slug: 'delta-region-visit-2',
    excerptEn: 'Our sales team concluded a successful visit to top dealers in Mansoura and Tanta.',
    excerptAr: 'أنهى فريق المبيعات بنجاح زيارة لأهم الموزعين في المنصورة وطنطا.',
    contentEn: '<h2>Delta Region</h2><p>We are expanding our presence in the Delta region with new support centers.</p>',
    contentAr: '<h2 style="text-align:right">منطقة الدلتا</h2><p style="text-align:right">نقوم بتوسيع انتشارنا في الدلتا عبر مراكز دعم جديدة للتجار والموزعين.</p>',
    category: 'Store Visits',
    thumbnail: 'https://images.unsplash.com/photo-1611762947113-a44274092b3a?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
    views: 410
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutd_erp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to DB');
    await Article.insertMany(dummyArticles);
    console.log('Articles seeded');
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit(1);
});
