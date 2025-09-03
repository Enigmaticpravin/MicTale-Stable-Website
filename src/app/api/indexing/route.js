import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request) {
  try {
    const { url, type = 'URL_UPDATED' } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    )

    await jwtClient.authorize()

    const indexing = google.indexing({
      version: 'v3',
      auth: jwtClient
    })

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type
      }
    })

    return NextResponse.json({
      success: true,
      message: 'URL submitted for indexing',
      googleResponse: response.data
    })

  } catch (error) {
    console.error('Indexing API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit URL for indexing', details: error.message },
      { status: 500 }
    )
  }
}

export async function triggerIndexing(blogSlug) {
  const url = `https://mictale.in/blog/${blogSlug}`
  
  try {
    const response = await fetch('/api/indexing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' })
    })
    
    return response.ok
  } catch (error) {
    console.error('Failed to trigger indexing:', error)
    return false
  }
}