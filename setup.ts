import { randomBytes } from "crypto";
import fs from "fs";

const templateEnv = `
PORT=${process.env.NODE_ENV === "development" ? 5000 : 3000}
BASE_URL="${
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://image-storage-api.anfa.my.id"
}"
ORIGINS="http://localhost:3000, https://image-storage-api.anfa.my.id"
API_KEY="${randomBytes(32).toString("hex")}"

# MongoDB URL
MONGODB_URL=""
`;

(async () => {
    const configPath = `${process.cwd()}/config`;
    const envPath = `${configPath}/${
        process.env.NODE_ENV === "development" ? ".env.development" : ".env"
    }`;

    try {
        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath);
        }

        fs.writeFileSync(envPath, templateEnv);

        console.info("Your app ready to run!");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
