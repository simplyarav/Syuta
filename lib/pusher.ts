import Pusher from 'pusher';

// Bypass initialization if env vars are missing to prevent crash during build/dev
const hasPusherConfig = process.env.PUSHER_APP_ID && process.env.NEXT_PUBLIC_PUSHER_KEY;

export const pusherServer = hasPusherConfig ? new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  useTLS: true,
}) : null;
