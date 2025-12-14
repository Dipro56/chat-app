import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/context/AuthContext";   // <-- add this
import { SidebarProvider } from "./context/SidebarContext";
import { SelectedUserProvider } from "./context/SelectedUserContext";
import { configureEcho } from '@laravel/echo-react';
import './echo';

// configureEcho({
//     broadcaster: 'reverb',
// });

try {
    configureEcho({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'reverb-local-key',
        wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
        wsPort: import.meta.env.VITE_REVERB_PORT || 6001,
        wssPort: import.meta.env.VITE_REVERB_PORT || 6001,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });
    console.log('✅ Echo configured successfully');
} catch (error) {
    console.error('❌ Echo configuration failed:', error);
}


const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AuthProvider>          {/* <-- Wrap here */}
                <SelectedUserProvider>
                    <SidebarProvider>
                        <App {...props} />
                    </SidebarProvider>
                </SelectedUserProvider>

            </AuthProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
