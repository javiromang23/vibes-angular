export class User {
    constructor(
        public id: string,
        public email: string,
        public username: string,
        public password: string,
        public name: string,
        public typeAccount: string,
        public signUpDate: Date,
        public avatar: string,
        public website: string,
        public bio: string,
        public sex: string
    ) {}
}
