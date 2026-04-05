const http = require('http');

const data = JSON.stringify({
    companyName: "Al-Nour Auto Parts",
    contactPerson: "Ahmed Hassan",
    email: "ahmed@alnour.com",
    password: "password123",
    status: "Approved"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/dealers',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let raw = '';
    res.on('data', (c) => raw += c);
    res.on('end', () => console.log('Response:', raw));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
