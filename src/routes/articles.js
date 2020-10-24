import article from "controlers/article"
import { reqUserFromToken } from "libs/jwt"

module.exports = express =>
  new express.Router()
    .get("/types", article.getTypes)
    .get("/slug/:slug", article.getbySlug)
    .get("/:id", article.get)
    .get("", article.getAll)
    .use(reqUserFromToken)
    .post("", article.post)
    .post("/upload/image", article.uploadImage)
    .delete("/:id", article.delete)
    .put("/:id", article.put)

