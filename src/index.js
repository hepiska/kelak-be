import useRouter from "routes"
import bodyParser from "body-parser"
import { errorMidleware } from "libs/errorMidleware"
import resJsonOnData from "libs/resJsonOnData"
import cors from "cors"
import morgan from "morgan"
import { swaggerDocument } from "./swager-doc"
import swaggerUi from "swagger-ui-express"
import { connectDb } from "./models"


// import cookieParser from "cookie-parser"
const express = require("express")


connectDb().catch(err => {
  console.log("err", err)
})

const PORT = process.env.PORT || 4000
const app = express()


// parse application/x-www-form-urlencoded
app.use(morgan("combined"))
app.use(cors({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }))

// parse application/json
app.use(bodyParser.json({ extended: false, limit: "50mb" }))
app.use(resJsonOnData)
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/alive", (req, res) => {
  return res.json("alive new test")
})

app.use("/", useRouter(express))

app.use(errorMidleware)


app.listen({ port: PORT }, () => {
  console.log(`server run on port ${PORT}`)
})
