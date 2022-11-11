import * as flags from "https://deno.land/std@0.163.0/flags/mod.ts";
import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

const params = z.object({
    env: z.string().min(1, `Provide flag: --env="\\path\\to\\env.json"`).default("env.json"),
});

const envkeys = z.string().array();

if (import.meta.main) {
    const parseResult = params.safeParse(flags.parse(Deno.args));
    if (parseResult.success == false) {
        let msg = `ERROR: invalid params:`;
        for (let i = 0; i < parseResult.error.errors.length; i++) {
            const err = parseResult.error.errors[i];
            msg += `\n  ${err.path.join(".")}: ${err.message}`;
        }
        console.error(msg);
        Deno.exit(1);
    }

    const envPath = parseResult.data.env;
    console.info(`Env file: ${envPath}`);

    const requiredKeys = getRequiredKeys(envPath);
    const missingKeys = checkEnv(requiredKeys);
    if (missingKeys.length > 0) {
        const error = `ERROR: some variables are undefined: ${missingKeys.length}:\n  ${missingKeys.join("\n  ")}`;
        console.error(error);
        Deno.exit(1);
    }

    console.info(`All variables found: ${requiredKeys.length}`);
}

function getRequiredKeys(envPath: string): string[] {
    const parseResult = envkeys.safeParse(JSON.parse(Deno.readTextFileSync(envPath)));
    if (parseResult.success == false) {
        let msg = `ERROR: invalid params:`;
        for (let i = 0; i < parseResult.error.errors.length; i++) {
            const err = parseResult.error.errors[i];
            msg += `\n  ${err.path.join(".")}: ${err.message}`;
        }
        console.error(msg);
        Deno.exit(1);
    }

    const requiredKeys = parseResult.data;
    return requiredKeys;
}

export function checkEnv(requiredKeys: string[]): string[] {
    console.info("Checking environment variables...");
    const missingKeys = [];

    for (let i = 0; i < requiredKeys.length; i++) {
        const requiredKey = requiredKeys[i];
        const exists = Deno.env.get(requiredKey) != null;

        if (!exists) {
            missingKeys.push(requiredKey);
        }
    }

    return missingKeys;
}
