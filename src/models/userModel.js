const bcrypt = require('bcrypt');
const pool = require('../../config/database');

class UserRepository {

    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await pool.query(
            'INSERT INTO users(user_name, email, pass) VALUES($1, $2, $3) RETURNING user_id, user_name, email, created_at',
            [userData.name, userData.email, hashedPassword]
        );
    }

    async findByEmail(email) {
        return await pool.query(
            `SELECT user_id, email, user_name, pass, wallet FROM users WHERE email = $1`,
            email
        );
    }
    

    async findById(user_id) {
        return await pool.query(
            `SELECT user_id, user_name, email, created_at FROM users WHERE user_id = $1`,
            user_id
        );
    }
    

    async findByname(username) {
        return await pool.query(
            `SELECT user_id, user_name, email, created_at FROM users WHERE user_name = $1`,
            username
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

    static async updateWallet(userId, amount) {
        const query = 'UPDATE users SET wallet = wallet + $1 WHERE user_id = $2 RETURNING *';
        const result = await pool.query(query, [amount, userId]);
        return result.rows[0];
    }
}

module.exports = UserRepository;