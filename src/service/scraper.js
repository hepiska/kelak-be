import axios from "axios"
const { SCRAPER_URI, } = process.env


export const scraperRequest = axios.create({
  baseUrl: SCRAPER_URI
})


