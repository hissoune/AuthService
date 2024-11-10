import { UserDocument } from "../../schemas/user.schema";
import { UserEntity } from "../../entities/user.entity";

export interface AuthInterface {
    register(user: UserEntity): Promise<UserDocument>;


    login(user: UserEntity): Promise< {token: string} >;

   

    
}
