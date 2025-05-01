import { hashPassword, comparePassword } from '../../utils/passwordUtils.js';
import { createPool } from '../../config/dbConfig.js'; // Ahora importamos createPool

const pool = createPool(); // Creamos el pool una vez


export class HttpModel {

    // Función para obtener el usuario basado en el correo y la contraseña
    static async login({ email, pass }) {
        const connection = await pool.getConnection(); // Obtener una conexión del pool

        try {
            const [users] = await connection.query(
                "SELECT BIN_TO_UUID(id) AS id, email, pass, userName FROM userTable WHERE email = ?;",
                [email]
            );

            if (users.length === 0) {
                return { success: false, message: "Usuario no encontrado" };
            }

            const user = users[0];
            const isMatch = await comparePassword(pass, user.pass);

            if (!isMatch) {
                return { success: false, message: "Contraseña incorrecta" };
            }

            delete user.pass;
            return { success: true, user };

        } catch (error) {
            console.error('Error en la consulta de usuario:', error);
            return { success: false, message: "Error interno del servidor" };
        } finally {
            connection.release(); // Liberar la conexión al pool
        }
    }

    // Función para crear un nuevo usuario
    static async register({ email, pass, userName }) {
        const connection = await pool.getConnection();

        try {
            const [result] = await connection.query(
                "SELECT BIN_TO_UUID(id) AS id, email, pass, userName FROM userTable WHERE email = ?;",
                [email]
            );

            if (result.length > 0) {
                return { success: false, message: "El usuario ya existe" };
            }

            const hashedPassword = await hashPassword(pass);

            await connection.execute(
                "INSERT INTO userTable (email, pass, userName) VALUES (?, ?, ?);",
                [email, hashedPassword, userName]
            );

            const [users] = await connection.execute(
                "SELECT BIN_TO_UUID(id) AS id, email, pass, userName FROM userTable WHERE email = ?;",
                [email]
            );

            const user = users[0];
            delete user.pass;

            return { success: true, user };

        } catch (error) {
            console.error('Error creando usuario:', error);
            return { success: false, message: "Error interno del servidor" };
        } finally {
            connection.release();
        }
    }
}
