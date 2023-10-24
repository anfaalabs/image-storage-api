import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const templateEnv = `PORT=${isDev ? 5000 : 3000}
BASE_URL="${
    isDev ? "http://localhost:3000" : "https://image-storage-api.anfa.my.id"
}"
ORIGINS="http://localhost:3000, https://image-storage-api.anfa.my.id"
API_KEY="${randomBytes(32).toString("hex")}"

# MongoDB URL
MONGODB_URL=""
`;

(async () => {
    // const configPath = `${process.cwd()}/config`;
    const configPath = path.resolve(process.cwd(), "config");
    const envPath = path.relative(
        configPath,
        isDev ? ".env.development" : ".env"
    );

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
