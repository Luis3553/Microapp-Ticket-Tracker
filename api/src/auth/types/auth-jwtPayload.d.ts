import { PublicUser } from 'src/types/user';

export type AuthJwtPayload = Omit<PublicUser, 'name' | 'email'>;
