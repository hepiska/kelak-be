import cron from "node-cron"
import { scraperRequest } from "./scraper"

const scraperTarget = ["post_belitung", "post_belitung_beltim", "detik", "kompas_viral", "detik_finance", "detik_inet"]


cron.schedule("3 * * * * *", () => {
  scraperTarget.forEach(async target => {
    try {
      await scraperRequest.get(`/scrape/${target}`)

    } catch (error) {
      console.error(error.message)
    }
  })

})
