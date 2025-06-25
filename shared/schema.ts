import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  whatsapp: text("whatsapp"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentPhase: integer("current_phase").default(0).notNull(),
  confidenceBaseline: integer("confidence_baseline"),
  confidenceCurrent: integer("confidence_current"),
  yearsExperience: integer("years_experience"),
  keySkills: text("key_skills"),
  narrative: text("narrative"),
  achievements: jsonb("achievements"),
  coreSkills: jsonb("core_skills"),
  skillGaps: jsonb("skill_gaps"),
  storyScore: integer("story_score").default(0),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salaryRange: text("salary_range"),
  matchPercentage: integer("match_percentage").notNull(),
  status: text("status").notNull(), // 'available', 'pending', 'locked'
  description: text("description"),
});

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  isShortlisted: boolean("is_shortlisted").default(false),
  isSelected: boolean("is_selected").default(false),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  status: text("status").notNull(), // 'sent', 'viewed', 'interview', 'rejected'
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  method: text("method"), // 'easyapply', 'email'
});

export const confidenceEntries = pgTable("confidence_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  confidenceLevel: integer("confidence_level").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  type: text("type").notNull(), // 'training', 'mentor', 'updates'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
});

export const insertConfidenceEntrySchema = createInsertSchema(confidenceEntries).omit({
  id: true,
  recordedAt: true,
});

export const insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Role = typeof roles.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ConfidenceEntry = typeof confidenceEntries.$inferSelect;
export type InsertConfidenceEntry = z.infer<typeof insertConfidenceEntrySchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistEntrySchema>;
