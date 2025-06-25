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

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private userProgress: Map<number, UserProgress> = new Map();
  private roles: Map<number, Role> = new Map();
  private userRoles: Map<string, UserRole> = new Map(); // key: userId_roleId
  private applications: Map<number, Application> = new Map();
  private confidenceEntries: Map<number, ConfidenceEntry> = new Map();
  private waitlistEntries: Map<number, WaitlistEntry> = new Map();
  
  private currentUserId = 1;
  private currentProgressId = 1;
  private currentUserRoleId = 1;
  private currentApplicationId = 1;
  private currentConfidenceId = 1;
  private currentWaitlistId = 1;

  constructor() {
    this.seedRoles();
  }

  private seedRoles() {
    const sampleRoles: Omit<Role, 'id'>[] = [
      {
        title: "Digital Marketing Manager",
        company: "TechCorp Inc.",
        location: "Remote",
        salaryRange: "₹8L-₹12L",
        matchPercentage: 92,
        status: "available",
        description: "Lead digital marketing campaigns and strategy for a growing tech company."
      },
      {
        title: "Brand Strategy Specialist",
        company: "CreativeHub",
        location: "Hybrid",
        salaryRange: "₹6L-₹10L",
        matchPercentage: 88,
        status: "pending",
        description: "Develop and execute brand strategies for creative agency clients."
      },
      {
        title: "Content Marketing Lead",
        company: "StartupX",
        location: "On-site",
        salaryRange: "₹7L-₹14L",
        matchPercentage: 85,
        status: "available",
        description: "Lead content marketing initiatives and team for fast-growing startup."
      }
    ];

    sampleRoles.forEach((role, index) => {
      this.roles.set(index + 1, { ...role, id: index + 1 });
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(progress => progress.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = { ...insertProgress, id };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = await this.getUserProgress(userId);
    if (!existing) {
      throw new Error("User progress not found");
    }
    
    const updated: UserProgress = { ...existing, ...updates };
    this.userProgress.set(existing.id, updated);
    return updated;
  }

  async getRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async getRole(id: number): Promise<Role | undefined> {
    return this.roles.get(id);
  }

  async getUserRoles(userId: number): Promise<(UserRole & { role: Role })[]> {
    const userRolesList = Array.from(this.userRoles.values()).filter(ur => ur.userId === userId);
    return userRolesList.map(ur => ({
      ...ur,
      role: this.roles.get(ur.roleId)!
    }));
  }

  async addUserRole(userId: number, roleId: number, isShortlisted = false): Promise<UserRole> {
    const id = this.currentUserRoleId++;
    const userRole: UserRole = {
      id,
      userId,
      roleId,
      isShortlisted,
      isSelected: false
    };
    this.userRoles.set(`${userId}_${roleId}`, userRole);
    return userRole;
  }

  async updateUserRole(userId: number, roleId: number, updates: Partial<{ isShortlisted: boolean; isSelected: boolean }>): Promise<UserRole> {
    const key = `${userId}_${roleId}`;
    const existing = this.userRoles.get(key);
    if (!existing) {
      throw new Error("User role not found");
    }
    
    const updated: UserRole = { ...existing, ...updates };
    this.userRoles.set(key, updated);
    return updated;
  }

  async getUserApplications(userId: number): Promise<(Application & { role: Role })[]> {
    const userApps = Array.from(this.applications.values()).filter(app => app.userId === userId);
    return userApps.map(app => ({
      ...app,
      role: this.roles.get(app.roleId)!
    }));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const application: Application = {
      ...insertApplication,
      id,
      submittedAt: new Date()
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application> {
    const existing = this.applications.get(id);
    if (!existing) {
      throw new Error("Application not found");
    }
    
    const updated: Application = { ...existing, ...updates };
    this.applications.set(id, updated);
    return updated;
  }

  async addConfidenceEntry(insertEntry: InsertConfidenceEntry): Promise<ConfidenceEntry> {
    const id = this.currentConfidenceId++;
    const entry: ConfidenceEntry = {
      ...insertEntry,
      id,
      recordedAt: new Date()
    };
    this.confidenceEntries.set(id, entry);
    return entry;
  }

  async getUserConfidenceHistory(userId: number): Promise<ConfidenceEntry[]> {
    return Array.from(this.confidenceEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());
  }

  async addToWaitlist(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentWaitlistId++;
    const entry: WaitlistEntry = {
      ...insertEntry,
      id,
      createdAt: new Date()
    };
    this.waitlistEntries.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
