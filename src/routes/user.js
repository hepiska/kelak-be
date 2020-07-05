import user from "controlers/user"
import { reqUserFromToken } from "libs/jwt"


module.exports = express =>
  new express.Router().post("/", user.post)
    .get("", user.getAll)
    .get("/:id", user.get)
    .use(reqUserFromToken)

    .delete("/:id", user.delete)
    .put("/:id", user.put)
