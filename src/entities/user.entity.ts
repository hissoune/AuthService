export class UserEntity {
    constructor(
       
        public readonly email: string,
        public password: string,
        public readonly name?: string,
        public readonly phone?: number
    ) {}
}
