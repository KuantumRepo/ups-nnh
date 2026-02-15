declare module 'react-turnstile' {
    import * as React from 'react';

    interface TurnstileProps {
        sitekey: string;
        onVerify: (token: string) => void;
        onError?: (error: any) => void;
        onExpire?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'compact';
        tabIndex?: number;
        action?: string;
        cdata?: string;
    }

    const Turnstile: React.FC<TurnstileProps>;
    export default Turnstile;
}
