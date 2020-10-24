import category from "controlers/category"
import { reqUserFromToken } from "libs/jwt"


module.exports = express =>
  new express.Router()
    .get("/slug/:slug", category.getbySlug)
    .get("", category.getAll)
    .get("/:id", category.get)
    .use(reqUserFromToken)
    .post("", category.post)
    .delete("/:id", category.delete)
    .put("/:id", category.put)

