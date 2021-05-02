import axios from "axios"
const { SCRAPER_URI } = process.env


export const scraperRequest = axios.create({
  baseURL: SCRAPER_URI
})


