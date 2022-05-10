import { NextResponse } from 'next/server'

export function middleware(req, event) {
  const { pathname, searchParams } = req.nextUrl
  if (searchParams.has('language')) {
    const locale = searchParams.get('language')
    const url = req.nextUrl.clone()
    try {
      url.locale = locale
    } catch (error) {
      url.pathname = `/${locale}${pathname}`
    }
    return NextResponse.rewrite(url)
  }
  return
}