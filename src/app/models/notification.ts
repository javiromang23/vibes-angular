import { User } from './user';
import { Publication } from './publication';

export class Notification {
    constructor(
        public _id: string,
        public user: User,
        public fromUser: User,
        public toDate: Date,
        public message: string,
        public publication: Publication
    ) {}
}
