const http = require('http');

const vehicleDB = {
    'Toyota': { 'Camry': [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    'Volkswagen': { 'Golf': [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], 'Passat': [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], 'Tiguan': [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], 'Polo': [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
};

http.get('http://localhost:5000/api/products', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
        const json = JSON.parse(raw);
        const allProducts = json.data.map(p => {
            let foundMake = 'Toyota';
            for(let make in vehicleDB) {
                if(p.compatibility.some(m => vehicleDB[make][m])) { foundMake = make; break; }
            }
            return {
                id: p.sku,
                sku: p.sku,
                name: p.nameEn,
                nameAr: p.nameAr,
                brand: p.brand,
                cat: p.category,
                make: foundMake,
                models: p.compatibility,
                years: [2019],
                stock: p.stock > 10 ? 'in' : (p.stock > 0 ? 'low' : 'out')
            };
        });

        // applyFilters logic
        const brands = [];
        const cats = [];
        const makes = [];
        const activeCatPill = '';
        const stocks = [];
        let vsbMake = '';
        let vsbModel = '';
        let vsbYear = '';
        const q = '';

        const filtered = allProducts.filter(p => {
            if (brands.length && !brands.includes(p.brand)) return false;
            if (cats.length && !cats.includes(p.cat)) return false;
            if (makes.length && !makes.includes(p.make)) return false;
            if (activeCatPill && p.cat !== activeCatPill) return false;
            if (stocks.length && !stocks.includes(p.stock || 'in')) return false;
            // Vehicle bar filter
            if (vsbMake && p.make !== vsbMake) return false;
            if (vsbModel && !(p.models || []).includes(vsbModel)) return false;
            if (vsbYear && !(p.years || []).includes(Number(vsbYear))) return false;
            if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.nameAr.includes(q)) return false;
            return true;
        });

        console.log("Filtered Length:", filtered.length);
    });
});
