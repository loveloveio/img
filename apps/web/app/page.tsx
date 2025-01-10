import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export default async function Home() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const ua = new UAParser(userAgent);
  if(ua.getDevice().is('mobile')) {
    redirect('/member/mobile');
  }
  redirect('/member/pc');
}
