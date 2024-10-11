import { chromium } from "playwright";


export async function GET (request: Request) {
  const params = new URL(request.url).searchParams;
  let url
  
  try {
    const rawUrl = params.get("url");
    if (!rawUrl) throw new Error("No URL provided")
    url = new URL(rawUrl).href;
  } catch (error) {
    const err = error as Error;
    return Response.json(
      { 
        error: "Invalid URL",
        errorDetails: err.message
       },
      { status: 400 }
    )
  }
  

  const urlPattern = /^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/;
  const match = url.match(urlPattern);
  const domain = match ? match[1].split(".")[0] : null;

  const patternsForSite: { [key: string]: RegExp } = {
    // get post id from url
    "instagram": /instagram\.com\/p\/([^\/?]+)/,
  }

  if (!domain || !patternsForSite[domain]) {
    return Response.json(
      { error: "Unsupported domain" },
      { status: 400 }
    )
  }

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("._aagv");

  const image = await page.$$eval(
    "._aagv img",
    (elements: HTMLImageElement[]) => (
      elements[0].getAttribute("src")
    )
  )

  browser.close();

  const res = await fetch(image as string);

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }

  console.log(res)
  const imageBlob = await res.blob();

  return new Response(imageBlob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "image/jpeg"
    }
  })
}