export interface User {
    id?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
    cargo?: string;
    [key: string]: any; // Opcional: permite propiedades adicionales
}
