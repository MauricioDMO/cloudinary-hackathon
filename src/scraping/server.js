import express from 'express'
import { chromium } from 'playwright'
import { obtainDomainName } from './utils/getDomainName.js'
import { supportedPages } from './utils/pages.js'

const app = express()

app.use('/', (req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`)
  next()
})

app.get('/get-image', async (req, res) => {
  const url = req.query.url
  if (!url) {
    res.status(400).send({ error: 'URL is required' })
    return
  }

  const domainName = obtainDomainName(url)
  if (!domainName) {
    res.status(400).send({ error: 'Invalid URL' })
    return
  }

  const pageDetails = supportedPages[domainName]

  if (!pageDetails) {
    res.status(400).send({ error: 'Unsupported page' })
    return
  }

  const { locator, selector, attribute } = pageDetails

  const browser = await chromium.launch({
    headless: true
  })

  const page = await browser.newPage()

  await page.goto(url)

  page.on('console', msg => {
    // TODO: Manage 401 error
    // if (msg.type() === 'error')
  })

  try {
    const elementLocator = page.locator(locator).first()

    await elementLocator.waitFor({
      state: 'attached',
      timeout: 5000
    })
  } catch {
    browser.close()

    res.status(500).send({ error: 'Image not found' })
    return
  }

  const imageUrl = await page.$$eval(
    selector,
    (elements, attribute) => {
      console.log(elements[0])
      return elements[0]?.getAttribute(attribute)
    },
    attribute
  )
  browser.close()

  if (!imageUrl) {
    res.status(500).send({ error: 'Image not found' })
    return
  }

  res.send({ imageUrl, domainName })
})

app.get('/', (req, res) => {
  res.send('<h1>Image Scraping Server!</h1>')
})

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080')
})
