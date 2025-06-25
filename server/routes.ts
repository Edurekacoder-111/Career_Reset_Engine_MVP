import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, insertApplicationSchema, insertConfidenceEntrySchema, insertWaitlistEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration and progress
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Create initial progress record
      await storage.createUserProgress({
        userId: user.id,
        currentPhase: 0,
        confidenceBaseline: null,
        confidenceCurrent: null,
        yearsExperience: null,
        keySkills: null,
        narrative: null,
        achievements: null,
        coreSkills: null,
        skillGaps: null,
        storyScore: 0
      });
      
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const progress = await storage.updateUserProgress(userId, updates);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Roles
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const role = await storage.getRole(id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User roles
  app.get("/api/users/:userId/roles", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userRoles = await storage.getUserRoles(userId);
      res.json(userRoles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/roles/:roleId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const roleId = parseInt(req.params.roleId);
      const { isShortlisted } = req.body;
      
      const userRole = await storage.addUserRole(userId, roleId, isShortlisted);
      res.json(userRole);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/users/:userId/roles/:roleId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const roleId = parseInt(req.params.roleId);
      const updates = req.body;
      
      const userRole = await storage.updateUserRole(userId, roleId, updates);
      res.json(userRole);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Applications
  app.get("/api/users/:userId/applications", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await storage.getUserApplications(userId);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const application = await storage.updateApplication(id, updates);
      res.json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Confidence tracking
  app.post("/api/confidence", async (req, res) => {
    try {
      const entryData = insertConfidenceEntrySchema.parse(req.body);
      const entry = await storage.addConfidenceEntry(entryData);
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/confidence", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const history = await storage.getUserConfidenceHistory(userId);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      const entryData = insertWaitlistEntrySchema.parse(req.body);
      const entry = await storage.addToWaitlist(entryData);
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
