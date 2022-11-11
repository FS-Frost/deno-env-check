import { assertEquals } from "https://deno.land/std@0.163.0/testing/asserts.ts";
import { checkEnv } from "./main.ts";

Deno.test(function zeroMissingKeys() {
    const requiredKeys: string[] = ["KEY1", "KEY2"];
    for (let i = 0; i < requiredKeys.length; i++) {
        const key = requiredKeys[i];
        Deno.env.set(key, "value");
    }

    const missingKeys = checkEnv(requiredKeys);
    assertEquals(missingKeys.length, 0, "There should be 0 missing keys");
});

Deno.test(function someMissingKeys() {
    const requiredKeys: string[] = ["KEY1", "KEY2"];
    const missingKeysCount = 1;

    for (let i = 0; i < requiredKeys.length; i++) {
        const key = requiredKeys[i];
        Deno.env.delete(key);
    }

    for (let i = missingKeysCount; i < requiredKeys.length; i++) {
        const key = requiredKeys[i];
        Deno.env.set(key, "value");
    }

    const missingKeys = checkEnv(requiredKeys);
    assertEquals(
        missingKeys.length,
        requiredKeys.length - missingKeysCount,
        `There should be missing keys: ${missingKeysCount}, but found ${missingKeys.length}: ${missingKeys.join(",")}`
    );
});
