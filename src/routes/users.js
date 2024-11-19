const express = require('express');
const { authenticateToken } = require('./auth');
const { body, validationResult } = require('express-validator');

function createUserRoutes(userRepo) {
    const router = express.Router();

    router.use(authenticateToken);

    const validateUpdate = [
        body('name').optional().trim().notEmpty(),
        body('email').optional().isEmail(),
        body('password').optional().isLength({ min: 6 })
    ];

    // Get all users
    router.get('/', async (req, res, next) => {
        try {
            const users = await userRepo.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    });

    // Get current user
    router.get('/me', async (req, res, next) => {
        try {
            const user = await userRepo.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    });

    // Get a single user
    router.get('/:user_id', async (req, res, next) => {
        try {
            const user = await userRepo.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    });

    // Update user
    router.put('/:user_id', validateUpdate, async (req, res, next) => {
        try {
            if (req.params.id != req.user.userId) {
                return res.status(403).json({ 
                    error: 'You can only update your own profile' 
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await userRepo.update(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    });

    // Delete user
    router.delete('/:user_id', async (req, res, next) => {
        try {
            if (req.params.id != req.user.userId) {
                return res.status(403).json({ 
                    error: 'You can only delete your own profile' 
                });
            }

            const user = await userRepo.remove(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({
                message: 'User deleted successfully',
                user
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = createUserRoutes;