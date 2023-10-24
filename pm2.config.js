module.exports = {
    apps: [
        {
            name: "image-storage-api",
            script: "./build/start.js",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
