import { UserDocument } from "../../schemas/user.schema";
import { UserEntity } from "../../entities/user.entity";

export interface AuthInterface {
    register(user: UserEntity): Promise<UserDocument>;

    login(user: UserEntity): Promise<{ token: string }>;

    forgotPassword(email: string): Promise<{ email: string }>;

    resetPassword(resetToken: string, newPassword: string): Promise<{ message: string }>;
}
