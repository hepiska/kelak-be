import cron from "node-cron"
import { scraperRequest } from "./scraper"

const scraperTarget = ["post_belitung", "post_belitung_beltim", "detik", "kompas_viral", "detik_finance", "detik_inet"]


cron.schedule("0 */6 * * *", () => {
  scraperTarget.forEach(target => {
    scraperRequest.get(`/srape/${target}`)
  })

})
