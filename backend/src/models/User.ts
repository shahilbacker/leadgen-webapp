import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'viewer';

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokens: string[];
}

/**
 * In-memory user store seeded with default administrator and read-only viewer accounts.
 * Passwords are pre-hashed using bcrypt for cryptographic security.
 */
class UserRepository {
  private users: Map<string, IUser> = new Map();

  constructor() {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    // Salt & Hash for 'AdminPass123!'
    const adminHash = bcrypt.hashSync('AdminPass123!', 10);
    // Salt & Hash for 'ViewerPass123!'
    const viewerHash = bcrypt.hashSync('ViewerPass123!', 10);

    const adminUser: IUser = {
      id: 'usr_admin_001',
      name: 'Executive Administrator',
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: 'admin',
      refreshTokens: [],
    };

    const viewerUser: IUser = {
      id: 'usr_viewer_002',
      name: 'Auditing Viewer',
      email: 'viewer@example.com',
      passwordHash: viewerHash,
      role: 'viewer',
      refreshTokens: [],
    };

    this.users.set(adminUser.email.toLowerCase(), adminUser);
    this.users.set(viewerUser.email.toLowerCase(), viewerUser);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.get(email.toLowerCase());
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.id === id) return { ...user };
    }
    return null;
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        user.refreshTokens.push(token);
        // Keep max 5 active refresh sessions
        if (user.refreshTokens.length > 5) {
          user.refreshTokens.shift();
        }
        break;
      }
    }
  }

  async removeRefreshToken(userId: string, token: string): Promise<void> {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        break;
      }
    }
  }

  async hasRefreshToken(userId: string, token: string): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        return user.refreshTokens.includes(token);
      }
    }
    return false;
  }
}

export const userRepository = new UserRepository();
