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

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // User Progress
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  // Roles
  getRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  getUserRoles(userId: number): Promise<(UserRole & { role: Role })[]>;
  addUserRole(userId: number, roleId: number, isShortlisted?: boolean): Promise<UserRole>;
  updateUserRole(userId: number, roleId: number, updates: Partial<{ isShortlisted: boolean; isSelected: boolean }>): Promise<UserRole>;
  
  // Applications
  getUserApplications(userId: number): Promise<(Application & { role: Role })[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application>;
  
  // Confidence tracking
  addConfidenceEntry(entry: InsertConfidenceEntry): Promise<ConfidenceEntry>;
  getUserConfidenceHistory(userId: number): Promise<ConfidenceEntry[]>;
  
  // Waitlist
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
}

import { SupabaseStorage } from "./supabase-storage";

export const storage = new SupabaseStorage();