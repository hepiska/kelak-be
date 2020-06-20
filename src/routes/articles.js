import article from "controlers/article"
import { reqUserFromToken } from "libs/jwt"

module.exports = express =>
  new express.Router()
    .get("", article.getAll)
    .get("/:id", article.get)
    .use(reqUserFromToken)
    .post("", article.post)
    .post("/upload/image", article.uploadImage)
    .delete("/:id", article.delete)
    .put("/:id", article.put)

