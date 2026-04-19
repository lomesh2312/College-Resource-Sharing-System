import { Student } from "../../domain/models/User";
import { IRepository } from "../../domain/interfaces/IRepository";
import { Database } from "../Database";

export class StudentRepository implements IRepository<Student> {
  private prisma = Database.getInstance();

  public async findById(id: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  public async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  public async findAll(): Promise<Student[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.mapToDomain(user));
  }

  public async save(student: Student): Promise<Student> {
    const data = {
      email: student.email,
      name: student.name,
      password: student.getPasswordHash(),
      walletBalance: student.walletBalance,
    };

    const user = await this.prisma.user.upsert({
      where: { id: student.id || "" },
      update: data,
      create: { ...data, id: student.id },
    });

    return this.mapToDomain(user);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private mapToDomain(user: any): Student {
    return new Student(
      user.id,
      user.email,
      user.name,
      user.password,
      user.walletBalance,
      user.createdAt,
      user.updatedAt
    );
  }
}
