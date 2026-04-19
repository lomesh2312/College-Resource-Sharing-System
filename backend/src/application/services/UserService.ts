import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { Student } from "../../domain/models/User";
import { PasswordHasher, JWTManager } from "../../utils/AuthUtils";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  constructor(private studentRepo: StudentRepository) {}

  public async register(email: string, name: string, password: string): Promise<{ student: Student; token: string }> {
    const existing = await this.studentRepo.findByEmail(email);
    if (existing) {
      throw new Error("User with this email already exists.");
    }

    const passwordHash = await PasswordHasher.hash(password);
    const student = new Student(
      uuidv4(),
      email,
      name,
      passwordHash,
      100.0, 
      new Date(),
      new Date()
    );

    const savedStudent = await this.studentRepo.save(student);
    const token = JWTManager.generateToken({ id: savedStudent.id, email: savedStudent.email });

    return { student: savedStudent, token };
  }

  public async login(email: string, password: string): Promise<{ student: Student; token: string }> {
    const student = await this.studentRepo.findByEmail(email);
    if (!student) {
      throw new Error("Invalid email or password.");
    }

    const isValid = await PasswordHasher.compare(password, student.getPasswordHash());
    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    const token = JWTManager.generateToken({ id: student.id, email: student.email });
    return { student, token };
  }

  public async getProfile(id: string): Promise<Student | null> {
    return await this.studentRepo.findById(id);
  }
}
