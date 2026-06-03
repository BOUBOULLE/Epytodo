import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../config/db';
import { user_exist, hash_passwd, check_user } from '../../middleware/auth';
import { ResultSetHeader } from 'mysql2';

const router = express.Router();

router.post('/register', user_exist, hash_passwd, (req: Request, res: Response) => {
    db.query(
        'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
        [req.body.email, req.body.password, req.body.name, req.body.firstname],
        (err, result) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            const { insertId } = result as ResultSetHeader;
            const token = jwt.sign({ id: insertId }, process.env.SECRET as string, { expiresIn: '24h' });
            res.status(201).json({ token });
        }
    );
});

router.post('/login', check_user, (req: Request, res: Response) => {
    const token = jwt.sign({ id: req.user!.id }, process.env.SECRET as string, { expiresIn: '24h' });
    res.status(200).json({ token });
});

export default router;
