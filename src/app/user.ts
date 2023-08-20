export class User {
    constructor(
        public email: string,
        public password: string
    ){}
}

export class RegistrationUser{
    constructor(
        public firstname: string,
        public lastname: string,
        public email: string,
        public pwd: string,
        public rpwd: string
    ){}
}
