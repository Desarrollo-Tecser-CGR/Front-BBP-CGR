export interface Users {
    usuarios?: Usuario[];
}

export interface Usuario {
    idUser?:     number;
    userName?:   string;
    fullName?:   string;
    email?:      string;
    phone?:      null | string;
    enabled?:    boolean;
    dateModify?: number;
    cargo?:      null | string;
    roles?:      Role[];
}

export interface Role {
    id?:          number;
    name?:        string;
    enable?:      boolean;
    description?: string;
}