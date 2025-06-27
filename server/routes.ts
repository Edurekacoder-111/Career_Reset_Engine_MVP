import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, insertApplicationSchema, insertConfidenceEntrySchema, insertWaitlistEntrySchema } from "@shared/schema";

// Initialize OpenAI for AI integrations
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  // AI Integration Routes for n8n
  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const { education, workExperience, currentPhase } = req.body;
      
      // Generate AI-powered questions using OpenAI
      const prompt = `Based on the following user profile, generate 3 personalized career discovery questions:
      
Education: ${education || 'Not provided'}
Work Experience: ${workExperience || 'Not provided'}
Career Phase: ${currentPhase}

Generate questions that help understand career motivations, strengths, and aspirations. Each question should be thoughtful and open-ended. Return as JSON with format:
{
  "questions": [
    {
      "id": 1,
      "question": "Main question text",
      "type": "open",
      "followUp": "Follow-up prompt"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are a career coach AI that generates personalized discovery questions. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"questions": []}');
      
      // Webhook integration point for n8n (optional)
      try {
        // This would call n8n webhook if configured
        // await fetch(process.env.N8N_WEBHOOK_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ user_profile: req.body, generated_questions: response })
        // });
      } catch (webhookError) {
        console.log('n8n webhook not configured or failed:', webhookError);
      }

      res.json(response);
    } catch (error: any) {
      console.error('AI question generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate questions",
        questions: [
          {
            id: 1,
            question: "What specific achievements in your career are you most proud of?",
            type: "open",
            followUp: "What skills did you develop through this achievement?"
          },
          {
            id: 2,
            question: "What type of work environments help you perform at your best?",
            type: "open", 
            followUp: "How does this relate to your future career goals?"
          },
          {
            id: 3,
            question: "What are the biggest professional challenges you've overcome?",
            type: "open",
            followUp: "What did you learn from these experiences?"
          }
        ]
      });
    }
  });

  app.post("/api/ai/generate-narrative", async (req, res) => {
    try {
      const { education, workExperience, questionResponses, achievements, coreSkills } = req.body;
      
      const prompt = `Create a professional career narrative based on this information:

Education: ${education || 'Not specified'}
Work Experience: ${workExperience || 'Not specified'}
Question Responses: ${JSON.stringify(questionResponses)}
Achievements: ${JSON.stringify(achievements)}
Core Skills: ${JSON.stringify(coreSkills)}

Write a compelling 2-3 sentence career narrative that highlights strengths, experiences, and potential. Return as JSON:
{
  "narrative": "Professional narrative text here"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are a professional career narrative writer. Create compelling, concise career stories. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"narrative": ""}');
      
      // Optional n8n webhook for narrative generation tracking
      try {
        // await fetch(process.env.N8N_NARRATIVE_WEBHOOK_URL, {
        //   method: 'POST',
        //   body: JSON.stringify({ user_data: req.body, narrative: response })
        // });
      } catch (webhookError) {
        console.log('n8n narrative webhook not configured:', webhookError);
      }

      res.json(response);
    } catch (error: any) {
      console.error('AI narrative generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate narrative",
        narrative: "A dedicated professional with diverse experiences and proven achievements. Demonstrates strong commitment to professional growth and achievement. Ready to leverage their unique combination of skills and experiences in their next career opportunity."
      });
    }
  });

  // n8n Webhook Integration Endpoint
  app.post("/api/n8n/webhook", async (req, res) => {
    try {
      const webhookData = req.body;
      
      // Process n8n webhook data
      console.log('Received n8n webhook:', webhookData);
      
      // Handle different webhook types from n8n workflows
      switch (webhookData.type) {
        case 'career_analysis':
          // Process career analysis from n8n
          break;
        case 'question_followup':
          // Handle dynamic question follow-ups
          break;
        case 'narrative_enhancement':
          // Process narrative improvements
          break;
        default:
          console.log('Unknown webhook type:', webhookData.type);
      }
      
      res.json({ success: true, message: 'Webhook processed' });
    } catch (error: any) {
      console.error('n8n webhook processing error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
