import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { User } from '../types/models';

export function user_exist(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.email || !req.body.password || !req.body.name || !req.body.firstname) {
        res.status(400).json({ msg: 'Bad parameter' });
        return;
    }
    db.query('SELECT * FROM user WHERE email = ?', [req.body.email], (err, rows) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        const users = rows as User[];
        if (users.length > 0) {
            res.status(409).json({ msg: 'Account already exists' });
            return;
        }
        next();
    });
}

export function hash_passwd(req: Request, _res: Response, next: NextFunction) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    next();
}

export function check_user(req: Request, res: Response, next: NextFunction) {
    if (!req.body || !req.body.email || !req.body.password) {
        res.status(400).json({ msg: 'Bad parameter' });
        return;
    }
    db.query('SELECT * FROM user WHERE email = ?', [req.body.email], (err, rows) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        const users = rows as User[];
        if (users.length === 0 || !bcrypt.compareSync(req.body.password, users[0].password)) {
            res.status(401).json({ msg: 'Invalid Credentials' });
            return;
        }
        req.user = users[0];
        next();
    });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const raw_token = req.headers['authorization'];
    if (!raw_token || !raw_token.toLowerCase().startsWith('bearer ')) {
        res.status(401).json({ msg: 'No token, authorization denied' });
        return;
    }
    const token = raw_token.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as { id: number };
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
