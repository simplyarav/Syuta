import PusherClient from 'pusher-js';

// Singleton instance to prevent multiple connections in React
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return null;
  
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
      }
    );
  }
  return pusherClientInstance;
};
