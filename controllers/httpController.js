import { validateLoginReq } from '../schemas/login.js';
import { validateRegisterReq } from '../schemas/register.js';
import { HttpModel } from '../models/mySQL/http.js';
import { setTokenCookie } from '../utils/tokenUtils.js';



export class HttpController {

  // Reenviar el usuario si se recarga la pagina
  static async reload(req, res) {
    const { user } = req.session;
    let result = { success: false }
    if (user) result = { success: true, user }
    res.json(result)
  }


  // Login
  static async login(req, res) {

    const request = validateLoginReq(req.body)//comprobacion de la info de la req
    if (request.error) return res.status(400).json({ message: request.error.issues[0].message })

    //peticion a la bd
    const { email, pass } = request.data
    const result = await HttpModel.login({ email, pass })
    if (result.success) {
      setTokenCookie(res, result.user) //Si se puede hacer Login añadimes el token a la cookie
      return res.json(result)
    }
    return res.status(401).json(result)
  }


  // Registro
  static async register(req, res) {
    const request = validateRegisterReq(req.body)// comprobacion de la req
    if (request.error) return res.status(400).json({ message: request.error.issues[0].message })

    //peticion a la bd
    const { email, pass, userName } = request.data
    const result = await HttpModel.register({ email, pass, userName })
    if (result.success) {//Si se puede hacer Registro añadimes el token a la cookie
      setTokenCookie(res, result.user)
      return res.json(result)
    }
    return res.status(401).json(result)
  }


  // Redireccion (por si alguien quiere acceder a otras direcciones)
  static async redirectLogint(req, res) {
    res.redirect("/");
  };


  //Logout
  static async logout(req, res) {
    res.clearCookie('access_token')
    res.json({ success: true })
  }

}


