import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    test: {
        cache: false,
        include: ['test/**/*.test.ts'],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                {
                    browser: 'chromium'
                }
            ]
        },
        watch: false
    }
});
