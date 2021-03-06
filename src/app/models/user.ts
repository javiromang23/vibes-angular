export class User {
    constructor(
        public _id: string,
        public email: string,
        public username: string,
        public password: string,
        public name: string,
        public typeAccount: string,
        public signUpDate: Date,
        public avatar: any,
        public website: string,
        public bio: string,
        public sex: string,
        public isFollowed: boolean
    ) {}
}
