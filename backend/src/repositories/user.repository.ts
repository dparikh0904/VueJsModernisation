import { User, UserDTO } from '../types/user';

// In-memory database (replace with real database in production)
const users: Map<string, User> = new Map();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return users.get(id) || null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.set(user.id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };

    users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return users.delete(id);
  }

  async count(): Promise<number> {
    return users.size;
  }

  toDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    };
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const userRepository = new UserRepository();