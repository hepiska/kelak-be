import user from "controlers/user"
import { reqUserFromToken } from "libs/jwt"


module.exports = express =>
  new express.Router().post("/", user.post)
    // .get("", category.getAll)
    // .get("/:id", category.get)
    // .use(reqUserFromToken)

    // .delete("/:id", category.delete)
    // .put("/:id", category.put)
