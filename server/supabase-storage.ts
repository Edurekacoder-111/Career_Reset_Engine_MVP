import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { 
  users, 
  userProgress, 
  roles, 
  userRoles, 
  applications, 
  confidenceEntries, 
  waitlistEntries,
  type User, 
  type InsertUser,
  type UserProgress,
  type InsertUserProgress,
  type Role,
  type UserRole,
  type Application,
  type InsertApplication,
  type ConfidenceEntry,
  type InsertConfidenceEntry,
  type WaitlistEntry,
  type InsertWaitlistEntry
} from "@shared/schema";
import type { IStorage } from "./storage";

// Initialize Supabase database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class SupabaseStorage implements IStorage {
  
  constructor() {
    this.initializeRoles();
  }

  private async initializeRoles() {
    try {
      // Check if roles already exist
      const existingRoles = await db.select().from(roles).limit(1);
      if (existingRoles.length === 0) {
        // Seed default roles
        const defaultRoles = [
          {
            title: "Senior Product Manager",
            company: "TechCorp",
            location: "Bangalore",
            salaryRange: "₹25-35 LPA",
            matchPercentage: 92,
            status: "available",
            description: "Lead product strategy and development for enterprise software solutions."
          },
          {
            title: "Marketing Director",
            company: "StartupXYZ",
            location: "Mumbai",
            salaryRange: "₹30-40 LPA",
            matchPercentage: 87,
            status: "available",
            description: "Drive marketing strategy and team growth for fintech startup."
          },
          {
            title: "Data Science Lead",
            company: "DataInc",
            location: "Hyderabad",
            salaryRange: "₹35-45 LPA",
            matchPercentage: 78,
            status: "pending",
            description: "Lead data science initiatives and ML model development."
          },
          {
            title: "UX Design Manager",
            company: "DesignStudio",
            location: "Pune",
            salaryRange: "₹22-32 LPA",
            matchPercentage: 73,
            status: "locked",
            description: "Manage UX design team and drive user experience strategy."
          },
          {
            title: "Engineering Manager",
            company: "DevCorp",
            location: "Chennai",
            salaryRange: "₹28-38 LPA",
            matchPercentage: 85,
            status: "available",
            description: "Lead engineering teams and technical architecture decisions."
          }
        ];

        await db.insert(roles).values(defaultRoles);
      }
    } catch (error) {
      console.error('Failed to initialize roles:', error);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db.insert(userProgress).values(insertProgress).returning();
    return progress;
  }

  async updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [progress] = await db
      .update(userProgress)
      .set(updates)
      .where(eq(userProgress.userId, userId))
      .returning();
    
    if (!progress) {
      throw new Error("Progress not found");
    }
    return progress;
  }

  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async getUserRoles(userId: number): Promise<(UserRole & { role: Role })[]> {
    const result = await db
      .select()
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    
    return result.map(row => ({
      ...row.user_roles,
      role: row.roles
    }));
  }

  async addUserRole(userId: number, roleId: number, isShortlisted = false): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({ userId, roleId, isShortlisted, isSelected: false })
      .returning();
    return userRole;
  }

  async updateUserRole(userId: number, roleId: number, updates: Partial<{ isShortlisted: boolean; isSelected: boolean }>): Promise<UserRole> {
    const [userRole] = await db
      .update(userRoles)
      .set(updates)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .returning();
    
    if (!userRole) {
      throw new Error("User role not found");
    }
    return userRole;
  }

  async getUserApplications(userId: number): Promise<(Application & { role: Role })[]> {
    const result = await db
      .select()
      .from(applications)
      .innerJoin(roles, eq(applications.roleId, roles.id))
      .where(eq(applications.userId, userId));
    
    return result.map(row => ({
      ...row.applications,
      role: row.roles
    }));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    
    if (!application) {
      throw new Error("Application not found");
    }
    return application;
  }

  async addConfidenceEntry(insertEntry: InsertConfidenceEntry): Promise<ConfidenceEntry> {
    const [entry] = await db.insert(confidenceEntries).values(insertEntry).returning();
    return entry;
  }

  async getUserConfidenceHistory(userId: number): Promise<ConfidenceEntry[]> {
    return await db
      .select()
      .from(confidenceEntries)
      .where(eq(confidenceEntries.userId, userId))
      .orderBy(confidenceEntries.createdAt);
  }

  async addToWaitlist(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [entry] = await db.insert(waitlistEntries).values(insertEntry).returning();
    return entry;
  }
}