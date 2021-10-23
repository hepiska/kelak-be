import user from "controlers/user"
import { reqUserFromToken } from "libs/jwt"


module.exports = express =>
  new express.Router()
    .post("/", user.post)
    .use(reqUserFromToken)
    .get("/report/article", user.getArticleReport)
    .get("/roles", user.getRoles)
    .get("/:id", user.get)
    .get("", user.getAll)
    .delete("/:id", user.delete)
    .put("/:id", user.put)
