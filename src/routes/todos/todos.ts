import express, { Request, Response } from 'express';
import { verifyToken } from '../../middleware/auth';
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from './todos.query';

const router = express.Router();

router.get('/', verifyToken, (_req: Request, res: Response) => {
    getAllTodos((err, rows) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        res.status(200).json(rows);
    });
});

router.get('/:id', verifyToken, (req: Request, res: Response) => {
    getTodoById(req.params.id as string, (err, rows) => {
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

router.post('/', verifyToken, (req: Request, res: Response) => {
    const { title, description, due_time, user_id } = req.body;
    if (!title || !description || !due_time || !user_id) {
        res.status(400).json({ msg: 'Bad parameter' });
        return;
    }
    createTodo(req.body, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        getTodoById(result.insertId, (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            res.status(201).json(rows[0]);
        });
    });
});

router.put('/:id', verifyToken, (req: Request, res: Response) => {
    const { title, description, due_time, user_id, status } = req.body;
    if (!title || !description || !due_time || !user_id || !status) {
        res.status(400).json({ msg: 'Bad parameter' });
        return;
    }
    updateTodo(req.params.id as string, req.body, (err, result) => {
        if (err) {
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ msg: 'Not found' });
            return;
        }
        getTodoById(req.params.id as string, (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal server error' });
                return;
            }
            res.status(200).json(rows[0]);
        });
    });
});

router.delete('/:id', verifyToken, (req: Request, res: Response) => {
    deleteTodo(req.params.id as string, (err, result) => {
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
