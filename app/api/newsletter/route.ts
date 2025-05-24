import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create form data for Listmonk
    const formData = new FormData()
    formData.append('email', email)
    formData.append('l', '78826f7e-2743-4fcb-83d6-0508581bf8ae') // Newsletter list ID

    // Submit to Listmonk
    const response = await fetch('http://listmonk-fkw8s4wsw8wc0kw0880s8gsw.phishsimulator.com/subscription/form', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      console.error('Listmonk response error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
