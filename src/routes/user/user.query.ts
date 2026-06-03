import db from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { UserBody } from '../../types/models';

export function getUserById(id: number | string, callback: (err: any, rows: RowDataPacket[]) => void) {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback as any);
}

export function getUserByEmail(email: string, callback: (err: any, rows: RowDataPacket[]) => void) {
    db.query('SELECT * FROM user WHERE email = ?', [email], callback as any);
}

export function getUserTodos(id: number | string, callback: (err: any, rows: RowDataPacket[]) => void) {
    db.query('SELECT * FROM todo WHERE user_id = ?', [id], callback as any);
}

export function updateUser(id: number | string, data: UserBody, callback: (err: any, result: ResultSetHeader) => void) {
    db.query(
        'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
        [data.email, data.password, data.name, data.firstname, id],
        callback as any
    );
}

export function deleteUser(id: number | string, callback: (err: any, result: ResultSetHeader) => void) {
    db.query('DELETE FROM user WHERE id = ?', [id], callback as any);
}
