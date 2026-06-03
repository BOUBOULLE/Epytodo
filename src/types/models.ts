export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    firstname: string;
    created_at: Date;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    due_time: Date;
    user_id: number;
    status: 'not started' | 'todo' | 'in progress' | 'done';
    created_at: Date;
}

export interface TodoBody {
    title: string;
    description: string;
    due_time: string;
    user_id: number;
    status?: 'not started' | 'todo' | 'in progress' | 'done';
}

export interface UserBody {
    email: string;
    password: string;
    name: string;
    firstname: string;
}
