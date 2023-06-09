import { Status, User } from './types';

interface UserRepository {
  getAllUsers: (status?: Status[], search?: string) => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
}
