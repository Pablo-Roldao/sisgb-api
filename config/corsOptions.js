const whiteList = [
    'https://sisgb.vercel.app',
    'http://127.0.0.1:3000',
    'http://localhost:3000'
];

const corsOptions = {
    origin: {
        origin: (origin, callback) => {
            if (whiteList.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        optionsSuccessStatus: 200
    }
}

module.exports = corsOptions;