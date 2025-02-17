import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { UAParser } from 'ua-parser-js'
export default async function MemberPage() {
  const headersList = await headers()

  const parser = new UAParser(headersList.get('user-agent') || '')
  const device = parser.getDevice().type
  if (device === 'mobile') {    
    redirect('/member/mobile')
  } else {
    redirect('/member/pc')
  }
}
