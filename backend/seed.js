const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const seedProducts = [
    {
        sku: 'BSG-4401',
        nameEn: 'Front Shock Absorber',
        nameAr: 'ماص صدمات أمامي',
        descriptionEn: 'High performance gas-filled shock absorber for smooth ride.',
        descriptionAr: 'مساعد غازي عالي الأداء لتوفير قيادة ناعمة ومريحة.',
        imageUrl: 'https://images.unsplash.com/photo-1549646452-f47ce445ca1f?auto=format&fit=crop&w=400&q=80',
        brand: 'Borsching',
        category: 'Suspension',
        stock: 45,
        wholesalePrice: 850,
        retailPrice: 1050,
        vehicles: [
            { make: 'Skoda', model: 'Octavia', year: 'A7 (2013-2020)' },
            { make: 'Volkswagen', model: 'Golf', year: 'MK7 (2012-2020)' }
        ],
        isHot: true,
        isOE: true
    },
    {
        sku: 'KDD-7712',
        nameEn: 'Oil Filter Premium',
        nameAr: 'فلتر زيت بريميوم',
        descriptionEn: 'Premium synthetic blend oil filter provides up to 10k miles of engine protection.',
        descriptionAr: 'فلتر زيت بريميوم مصمم خصيصاً لتنقية الزيت لحوالي 10 آلاف ميل.',
        imageUrl: 'https://images.unsplash.com/photo-1628169213192-36fb1c49b068?auto=format&fit=crop&w=400&q=80',
        brand: 'KDD',
        category: 'Filters',
        stock: 120,
        wholesalePrice: 120,
        retailPrice: 150,
        vehicles: [
            { make: 'Volkswagen', model: 'Passat', year: 'B8 (2015-2023)' },
            { make: 'Skoda', model: 'Superb', year: '3V (2015-2024)' },
            { make: 'Seat', model: 'Leon', year: 'MK3 (2012-2020)' }
        ],
        isHot: false,
        isOE: false
    },
    {
        sku: 'VKA-2201',
        nameEn: 'Front Bumper Assembly',
        nameAr: 'كساحة صدام أمامي كاملة',
        descriptionEn: 'OEM spec front bumper cover replacement.',
        descriptionAr: 'شبكة الكساحة الأمامية مطابقة لمقاسات المصنع.',
        imageUrl: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=400&q=80',
        brand: 'Vika',
        category: 'Body',
        stock: 12,
        wholesalePrice: 2200,
        retailPrice: 2800,
        vehicles: [
            { make: 'Skoda', model: 'Octavia', year: 'A8 (2020+)' }
        ],
        isHot: false,
        isNew: true,
        isOE: false
    },
    {
        sku: 'BSG-8830',
        nameEn: 'Brake Disc Set',
        nameAr: 'طقم طنابير فرامل',
        descriptionEn: 'Ventilated front brake discs set for maximum stopping power.',
        descriptionAr: 'طقم طنابير فرامل أمامية بفتحات تهوية لقوة إيقاف مثالية.',
        imageUrl: 'https://images.unsplash.com/photo-1486262715619-6708c47b5936?auto=format&fit=crop&w=400&q=80',
        brand: 'Borsching',
        category: 'Braking',
        stock: 30,
        wholesalePrice: 1450,
        retailPrice: 1800,
        vehicles: [
            { make: 'Volkswagen', model: 'Golf', year: 'MK6 (2009-2013)' },
            { make: 'Skoda', model: 'Octavia', year: 'A5 (2004-2013)' }
        ],
        isHot: true,
        isOE: true
    },
    {
        sku: 'BSG-1102',
        nameEn: 'Ignition Coil',
        nameAr: 'موبينة إشعال',
        descriptionEn: 'High voltage ignition coil for stable spark timing.',
        descriptionAr: 'موبينة إشعال ذات فولتية عالية لضمان احتراق سليم للمحرك.',
        imageUrl: 'https://images.unsplash.com/photo-1549419131-7b003a3d53fb?auto=format&fit=crop&w=400&q=80',
        brand: 'Borsching',
        category: 'Electrical',
        stock: 65,
        wholesalePrice: 450,
        retailPrice: 580,
        vehicles: [
            { make: 'Seat', model: 'Ibiza', year: '6J (2008-2017)' },
            { make: 'Volkswagen', model: 'Polo', year: 'AW (2018+)' }
        ],
        isHot: false,
        isOE: true
    },
    {
        sku: 'KDD-8812',
        nameEn: 'Cabin Air Filter',
        nameAr: 'فلتر تكييف',
        descriptionEn: 'Charcoal activated cabin filter for blocking odors and dust.',
        descriptionAr: 'فلتر تكييف مطعم بالكربون النشط لمنع دخول الروائح والغبار للكابينة.',
        imageUrl: 'https://images.unsplash.com/photo-1628169213192-36fb1c49b068?auto=format&fit=crop&w=400&q=80',
        brand: 'KDD',
        category: 'Filters',
        stock: 200,
        wholesalePrice: 90,
        retailPrice: 130,
        vehicles: [
            { make: 'Skoda', model: 'Kodiaq', year: 'NS7 (2016+)' },
            { make: 'Volkswagen', model: 'Tiguan', year: 'AD1 (2016+)' }
        ],
        isNew: true,
        isOE: false
    }
];

async function seed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ntd_portal');
        console.log('Connected. Clearing old products...');
        await Product.deleteMany({});
        
        console.log('Inserting seed products...');
        await Product.insertMany(seedProducts);
        
        console.log('Seed successful! Added', seedProducts.length, 'products.');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seed();
