export async function submitToGoogleIndexing(url) {
  try {
    // 🔐 Decode base64 env
    const decoded = Buffer.from(
      process.env.GOOGLE_SERVICE_KEY_BASE64,
      'base64'
    ).toString('utf-8')

    const key = JSON.parse(decoded)

    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }

    const now = Math.floor(Date.now() / 1000)

    const payload = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: key.token_uri,
      iat: now,
      exp: now + 3600
    }

    const base64url = (obj) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    const unsignedToken =
      base64url(header) + '.' + base64url(payload)

    const crypto = await import('crypto')

    const signature = crypto
      .createSign('RSA-SHA256')
      .update(unsignedToken)
      .sign(key.private_key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    const jwt = `${unsignedToken}.${signature}`

    const tokenRes = await fetch(key.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.log('Token error:', tokenData)
      return
    }

    const res = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED'
        })
      }
    )

    const data = await res.json()

    console.log('Indexing success:', data)

  } catch (err) {
    console.log('Indexing API error:', err.message)
  }
}