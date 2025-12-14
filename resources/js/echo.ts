import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.Pusher = Pusher;

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            // 'Authorization': `Bearer ${getToken()}`
        },
    },
});

// Assign to window first
window.Echo = echo;

// // Now you can use window.Echo
// const senderId = 1;
// const receiverId = 2;

// // Option 1: Dynamic channel name
// window.Echo.private(`chat.${senderId}.${receiverId}`)
//     .listen('MessageSent', (e: any) => {
//         console.log('New message:', e.message);
//     });

export default echo;
