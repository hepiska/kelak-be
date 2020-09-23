import ads from "controlers/ads"
import { reqUserFromToken } from "libs/jwt"

module.exports = express =>
  new express.Router()
    .get("/types", ads.getTypes)
    .get("/:id", ads.get)
    .get("", ads.getAll)
    .use(reqUserFromToken)
    .post("/upload/image", ads.uploadImage)
    .delete("/:id", ads.delete)
    .put("/:id", ads.put)
    .post("", ads.post)


