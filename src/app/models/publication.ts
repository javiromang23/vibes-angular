import { User } from './user';

export class Publication {
    constructor(
        public id: string,
        public image: any,
        public title: string,
        public user: User,
        public createdAt: Date,
        public description: string,
        public category: string,
        public mentions: Array<User>
    ) {}
}
