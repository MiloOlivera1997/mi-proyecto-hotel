import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from './vapid-keys';

const prisma = new PrismaClient();

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function sendPushNotification(userId: number, title: string, body: string, icon?: string, badge?: string) {
  const subscriptions = await prisma.pushNotification.findMany({
    where: { userId },
  });

  const payload = JSON.stringify({
    title,
    body,
    icon: icon || '/icon.png',
    badge: badge || '/badge.png',
  });

  const promises = subscriptions.map(sub =>
    webpush.sendNotification({
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    }, payload)
  );

  await Promise.all(promises);
}