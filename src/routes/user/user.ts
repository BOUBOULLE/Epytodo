import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../../middleware/auth';
import { getUserById, getUserByEmail, getUserTodos, updateUser, deleteUser } from './user.query';

const router = express.Router();

router.get('/', verifyToken, (req: Request, res: Response) => {
    getUserById(req.user!.id, (err, rows) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        if (rows.length === 0) {
            res.status(404).json({ msg: 'Not found' });
            return;
        }
        res.status(200).json(rows[0]);
    });
});

router.get('/todos', verifyToken, (req: Request, res: Response) => {
    getUserTodos(req.user!.id, (err, rows) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.get('/:id', verifyToken, (req: Request, res: Response) => {
    const param = req.params.id as string;
    if (isNaN(Number(param))) {
        getUserByEmail(param, (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            if (rows.length === 0) {
                res.status(404).json({ msg: 'Not found' });
                return;
            }
            res.status(200).json(rows[0]);
        });
    } else {
        getUserById(param, (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            if (rows.length === 0) {
                res.status(404).json({ msg: 'Not found' });
                return;
            }
            res.status(200).json(rows[0]);
        });
    }
});

router.put('/:id', verifyToken, (req: Request, res: Response) => {
    const { email, password, firstname, name } = req.body;
    if (!email || !password || !firstname || !name) {
        res.status(400).json({ msg: 'Bad parameter' });
        return;
    }
    req.body.password = bcrypt.hashSync(password, 10);
    updateUser(req.params.id as string, req.body, (err) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        getUserById(req.params.id as string, (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            if (rows.length === 0) {
                res.status(404).json({ msg: 'Not found' });
                return;
            }
            res.status(200).json(rows[0]);
        });
    });
});

router.delete('/:id', verifyToken, (req: Request, res: Response) => {
    deleteUser(req.params.id as string, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: 'Not found' });
            return;
        }
        res.status(200).json({ msg: `Successfully deleted record number: ${req.params.id}` });
    });
});

export default router;
