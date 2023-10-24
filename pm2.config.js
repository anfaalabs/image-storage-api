module.exports = {
    apps: [
        {
            name: "image-storage-api",
            script: "./build/start.js",
            exec_mode: "cluster"
        }
    ]
};
