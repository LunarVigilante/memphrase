declare module 'svelte-recaptcha-v2' {
    import type { SvelteComponentTyped } from 'svelte';

    export interface RecaptchaProps {
        siteKey: string;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
        tabindex?: number;
        hl?: string; // Language code
        badge?: 'bottomright' | 'bottomleft' | 'inline'; // For invisible reCAPTCHA, not v2 checkbox
    }

    export interface RecaptchaEvents {
        success: CustomEvent<{ response: string }>;
        error: CustomEvent<any>; // You might want to define a more specific error type if known
        expired: CustomEvent<void>;
    }

    export class Recaptcha extends SvelteComponentTyped<RecaptchaProps, RecaptchaEvents, {}> {}
} 