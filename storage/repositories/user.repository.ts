import { User } from "@/shared/types/user";
import { executeAsync, getFirstAsync } from "../db/database";

interface UserRowDB {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

const convertDBRowToUser = (row: UserRowDB): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: row.createdAt,
});

class UserRepository {
  async getUser(): Promise<User | null> {
    const row = await getFirstAsync<UserRowDB>(
      "SELECT * FROM users LIMIT 1",
    );
    if (!row) return null;
    return convertDBRowToUser(row);
  }

  async createUser(user: { id: string; name: string; email: string }): Promise<User> {
    const now = Date.now();
    await executeAsync(
      `INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)`,
      [user.id, user.name, user.email, now],
    );
    return (await this.getUser()) as User;
  }

  async updateUser(updates: { name?: string; email?: string }): Promise<User | null> {
    const user = await this.getUser();
    if (!user) return null;

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push("email = ?");
      values.push(updates.email);
    }

    if (fields.length === 0) return user;

    values.push(user.id);
    await executeAsync(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.getUser();
  }
}

export const userRepository = new UserRepository();
