import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { TodoBody } from '../../types/models';

export function getAllTodos(callback: (err: any, rows: RowDataPacket[]) => void) {
    db.query('SELECT * FROM todo', callback as any);
}

export function getTodoById(id: number | string, callback: (err: any, rows: RowDataPacket[]) => void) {
    db.query('SELECT * FROM todo WHERE id = ?', [id], callback as any);
}

export function createTodo(data: TodoBody, callback: (err: any, result: ResultSetHeader) => void) {
    db.query(
        'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
        [data.title, data.description, data.due_time, data.user_id, data.status || 'not started'],
        callback as any
    );
}

export function updateTodo(id: number | string, data: TodoBody, callback: (err: any, result: ResultSetHeader) => void) {
    db.query(
        'UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?',
        [data.title, data.description, data.due_time, data.user_id, data.status, id],
        callback as any
    );
}

export function deleteTodo(id: number | string, callback: (err: any, result: ResultSetHeader) => void) {
    db.query('DELETE FROM todo WHERE id = ?', [id], callback as any);
}
