export const isProduction = process.env.NODE_ENV === 'production'

export const scraperUrl = isProduction ? process.env.SCRAPER_URL : 'http://localhost:8080'
