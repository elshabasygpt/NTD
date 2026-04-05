const mongoose = require('mongoose');
const Dealer = require('./models/Dealer');

mongoose.connect('mongodb://localhost:27017/ntd_portal')
    .then(async () => {
        const dealers = await Dealer.find();
        console.log('Dealers count:', dealers.length);
        console.log(dealers);
        process.exit(0);
    })
    .catch(err => console.error(err));
