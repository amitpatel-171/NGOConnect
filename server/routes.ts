import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authMiddleware, adminMiddleware, type AuthRequest } from "./auth";
import type { Request, Response } from "express";
import { 
  insertUserSchema, insertEventSchema, insertEventRegistrationSchema, 
  insertDonationSchema, insertVolunteerApplicationSchema, insertContactSubmissionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        role: "donor",
      });

      const token = generateToken(user.id);
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Get event error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/events", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create event error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/events/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Update event error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/events/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/events/:id/register", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const eventId = req.params.id;
      const userId = req.user!.id;

      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (event.registered >= event.capacity) {
        return res.status(400).json({ error: "Event is full" });
      }

      const isRegistered = await storage.isUserRegisteredForEvent(userId, eventId);
      if (isRegistered) {
        return res.status(400).json({ error: "Already registered for this event" });
      }

      const registration = await storage.registerForEvent({ eventId, userId });
      res.json(registration);
    } catch (error) {
      console.error("Event registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/donations", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const donations = await storage.getAllDonations();
      res.json(donations);
    } catch (error) {
      console.error("Get donations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/donations/total", async (req: Request, res: Response) => {
    try {
      const total = await storage.getTotalDonations();
      res.json({ total });
    } catch (error) {
      console.error("Get total donations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/donations", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertDonationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const donation = await storage.createDonation(validatedData);
      res.json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create donation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/volunteer/apply", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertVolunteerApplicationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });

      const existingApplication = await storage.getUserVolunteerApplication(req.user!.id);
      if (existingApplication) {
        return res.status(400).json({ error: "You have already submitted a volunteer application" });
      }

      const application = await storage.createVolunteerApplication(validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create volunteer application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/volunteer/applications", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const applications = await storage.getAllVolunteerApplications();
      res.json(applications);
    } catch (error) {
      console.error("Get volunteer applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/volunteer/applications/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const application = await storage.updateVolunteerApplicationStatus(req.params.id, status);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (status === "approved") {
        await storage.updateUser(application.userId, { role: "volunteer" });
      }

      res.json(application);
    } catch (error) {
      console.error("Update volunteer application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create contact submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/contact/submissions", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get contact submissions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/events", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const registrations = await storage.getUserEventRegistrations(req.user!.id);
      const eventDetails = await Promise.all(
        registrations.map(async (reg) => {
          const event = await storage.getEvent(reg.eventId);
          return { registration: reg, event };
        })
      );
      res.json(eventDetails);
    } catch (error) {
      console.error("Get user events error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/donations", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const donations = await storage.getUserDonations(req.user!.id);
      res.json(donations);
    } catch (error) {
      console.error("Get user donations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/volunteer", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const application = await storage.getUserVolunteerApplication(req.user!.id);
      res.json(application || null);
    } catch (error) {
      console.error("Get user volunteer application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const [events, donations, volunteerApplications, totalDonations] = await Promise.all([
        storage.getAllEvents(),
        storage.getAllDonations(),
        storage.getAllVolunteerApplications(),
        storage.getTotalDonations(),
      ]);

      res.json({
        totalEvents: events.length,
        upcomingEvents: events.filter((e) => e.status === "upcoming").length,
        totalDonations: donations.length,
        totalDonationsAmount: totalDonations,
        totalVolunteerApplications: volunteerApplications.length,
        pendingApplications: volunteerApplications.filter((a) => a.status === "pending").length,
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
