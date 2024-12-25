const bcrypt = require('bcrypt');
const pool = require('../../config/database');

class UserModel {

    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        console.log("email " +userData.email + " username: " + userData.user_name + " password: " + userData.password + " \n hashed password:" + hashedPassword + "\n");
        return (await pool.query(
            'INSERT INTO users(user_name, pass, email) VALUES($1, $2, $3) RETURNING user_id, user_name, email, created_at, verification',
            [userData.user_name, hashedPassword, userData.email]
        )).rows[0];
    }

    async findByEmail(email) {
        return (await pool.query(
            `SELECT user_id, email, user_name, pass, wallet, verification, created_at FROM users WHERE email = $1`,
            [email]
        )).rows[0];
    }
    

    async findById(user_id) {
        console.log(`inside findbyid ${user_id}`);
        return (
            await pool.query(
                `SELECT user_id, user_name, email, wallet, avg_rating, verification, created_at FROM users WHERE user_id = $1`,
                [user_id]
            )
        ).rows[0];
    }

    async verify(user_id){
        console.log(`verified user id: ${user_id}`);
        return (
            await pool.query(
                `update users
                set verification = 'verified'
                where user_id = $1`,
                [user_id]
            )
        ).rows[0];
    }
    

    async findByname(username) {
        return await pool.query(
            `SELECT user_id, user_name, email, wallet, avg_rating, created_at FROM users WHERE user_name = $1`,
            [username]
        );
    }

    async findAll() {
        return await pool.query(
            `SELECT user_id, user_name, email, created_at FROM users ORDER BY id ASC`
        );
    }

    async update(user_id, userData) {
        const updates = [];
        const values = [];
        let updateQuery = 'UPDATE users SET ';

        if (userData.name) {
            updates.push(`user_name = '${updates.length + 1}'`);
            values.push(userData.name);
        }

        if (userData.email) {
            updates.push(`email = '${updates.length + 1}'`);
            values.push(userData.email);
        }

        if (userData.password) {
            updates.push(`password = '${updates.length + 1}'`);
            values.push(await bcrypt.hash(userData.password, 10));
        }

        if (updates.length === 0) {
            throw new Error('No update data provided');
        }

        updateQuery += updates.join(', ');
        updateQuery += ` WHERE user_id = ${updates.length + 1} RETURNING user_id, name, email, created_at`;
        values.push(user_id);

        return await pool.query(updateQuery, values);
    }

    async remove(user_id) {
        return await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING user_id, name, email, created_at',
            user_id
        );
    }

    async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }

    static async addwallet(user_id, amount) {
        const query = 'UPDATE users SET wallet = wallet + $1 WHERE user_id = $2 RETURNING *;';
        const result = await pool.query(query, [amount, user_id]);
        return result.rows[0];
    }

    static async addrating(user_id, rating) {
        const query = 'UPDATE ratings SET rating_value = rating WHERE seller_id = $2 RETURNING *;';
        const result = await pool.query(query, [rating, user_id]);
        return result.rows[0];
    }
}


module.exports = new UserModel();