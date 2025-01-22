export interface Notification {
    id?: string;
    expanded: boolean;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    readOnly: boolean;
    enabled: boolean;
    sAMAccountName?:string;
}