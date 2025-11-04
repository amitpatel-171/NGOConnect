import { db } from "./db";
import { 
  users, events, eventRegistrations, donations, volunteerApplications, contactSubmissions,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type EventRegistration, type InsertEventRegistration,
  type Donation, type InsertDonation,
  type VolunteerApplication, type InsertVolunteerApplication,
  type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  getUserEventRegistrations(userId: string): Promise<EventRegistration[]>;
  isUserRegisteredForEvent(userId: string, eventId: string): Promise<boolean>;
  
  createDonation(donation: InsertDonation): Promise<Donation>;
  getUserDonations(userId: string): Promise<Donation[]>;
  getAllDonations(): Promise<Donation[]>;
  getTotalDonations(): Promise<number>;
  
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication>;
  getUserVolunteerApplication(userId: string): Promise<VolunteerApplication | undefined>;
  getAllVolunteerApplications(): Promise<VolunteerApplication[]>;
  updateVolunteerApplicationStatus(id: string, status: string): Promise<VolunteerApplication | undefined>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    const result = await db.insert(eventRegistrations).values(registration).returning();
    await db.update(events)
      .set({ registered: sql`${events.registered} + 1` })
      .where(eq(events.id, registration.eventId));
    return result[0];
  }

  async getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
    return await db.select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(eventRegistrations.registeredAt));
  }

  async isUserRegisteredForEvent(userId: string, eventId: string): Promise<boolean> {
    const result = await db.select()
      .from(eventRegistrations)
      .where(and(
        eq(eventRegistrations.userId, userId),
        eq(eventRegistrations.eventId, eventId)
      ))
      .limit(1);
    return result.length > 0;
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const result = await db.insert(donations).values(donation).returning();
    return result[0];
  }

  async getUserDonations(userId: string): Promise<Donation[]> {
    return await db.select()
      .from(donations)
      .where(eq(donations.userId, userId as string))
      .orderBy(desc(donations.createdAt));
  }

  async getAllDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async getTotalDonations(): Promise<number> {
    const result = await db.select({ 
      total: sql<number>`COALESCE(SUM(CAST(${donations.amount} AS NUMERIC)), 0)` 
    }).from(donations).where(eq(donations.status, 'completed'));
    return Number(result[0].total);
  }

  async createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const result = await db.insert(volunteerApplications).values(application).returning();
    return result[0];
  }

  async getUserVolunteerApplication(userId: string): Promise<VolunteerApplication | undefined> {
    const result = await db.select()
      .from(volunteerApplications)
      .where(eq(volunteerApplications.userId, userId))
      .orderBy(desc(volunteerApplications.createdAt))
      .limit(1);
    return result[0];
  }

  async getAllVolunteerApplications(): Promise<VolunteerApplication[]> {
    return await db.select().from(volunteerApplications).orderBy(desc(volunteerApplications.createdAt));
  }

  async updateVolunteerApplicationStatus(id: string, status: string): Promise<VolunteerApplication | undefined> {
    const result = await db.update(volunteerApplications)
      .set({ status })
      .where(eq(volunteerApplications.id, id))
      .returning();
    return result[0];
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    const result = await db.update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
