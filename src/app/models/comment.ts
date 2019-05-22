import { User } from './user';
import { Publication } from './publication';

export class Comment {
    constructor(
        public _id: string,
        public publication: Publication,
        public user: User,
        public toDate: Date,
        public text: string
    ) {}
}
