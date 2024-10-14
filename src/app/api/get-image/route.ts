import { scraperUrl } from '@/consts'

export async function GET (request: Request) {
  const rawUrl = new URL(request.url)
    .searchParams.get('url')
  const response = await fetch(`${scraperUrl}/get-image?url=${rawUrl}`)

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error: response.statusText
      }),
      {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  const imageInfo = await response.json()

  const res = await fetch(imageInfo.imageUrl)
  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error: res.statusText
      }),
      {
        status: res.status,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  const image = await res.blob()

  return new Response(image, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      '-image-url': imageInfo.imageUrl,
      '-image-domain-name': imageInfo.domainName
    }
  })
}
