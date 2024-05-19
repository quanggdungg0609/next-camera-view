/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    serverRuntimeConfig:{
        API_URI: "https://acces.lanestel.fr:5000",
        REFRESH_EXP_TIME: "24h",
        ACCESS_EXP_TIME: "1m",
        AUTH_SECRET: "+LroEoF/v213NpSYS8ewgd8y+4HZqIK0Opp7bHMEWHk=",
        SECRET_KEY:"saltForEncrypting",
        IV:"5yK6a26cGoTitNTmc9McgA0tDS2xAp4ObQiTgXf5ucc="
    },

    env:{
        WS_URI: "wss://acces.lanestel.fr:5050",
    },
};

export default nextConfig;
