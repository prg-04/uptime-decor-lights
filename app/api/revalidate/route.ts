import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const body = await req.json()

    // Revalidate the listing
    revalidatePath('/products')

    // Revalidate product detail if slug/id provided
    if (body?.slug) {
      revalidatePath(`/product/${body.slug}`)
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return NextResponse.json({ message: 'Error', err }, { status: 500 })
  }
}