import { db } from "./db";
import { users, events, donations, volunteerApplications } from "@shared/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("Seeding database...");

  const hashedPassword = await hashPassword("password123");

  const adminUser = await db.insert(users).values({
    name: "Admin User",
    email: "admin@hopefoundation.org",
    password: hashedPassword,
    role: "admin",
  }).returning();

  const volunteer1 = await db.insert(users).values({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: hashedPassword,
    role: "volunteer",
  }).returning();

  const volunteer2 = await db.insert(users).values({
    name: "Michael Chen",
    email: "michael@example.com",
    password: hashedPassword,
    role: "volunteer",
  }).returning();

  const donor1 = await db.insert(users).values({
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: hashedPassword,
    role: "donor",
  }).returning();

  const donor2 = await db.insert(users).values({
    name: "David Williams",
    email: "david@example.com",
    password: hashedPassword,
    role: "donor",
  }).returning();

  console.log("Created users:", { adminUser, volunteer1, volunteer2, donor1, donor2 });

  const event1 = await db.insert(events).values({
    title: "Community Park Cleanup",
    description: "Join us for environmental action as we clean up our local park and plant trees for future generations.",
    date: new Date("2025-12-15T09:00:00"),
    location: "Central Park, Main Entrance",
    capacity: 60,
    registered: 15,
    status: "upcoming",
  }).returning();

  const event2 = await db.insert(events).values({
    title: "Youth Education Workshop",
    description: "Interactive learning session focused on STEM education for underprivileged children in our community.",
    date: new Date("2025-12-20T14:00:00"),
    location: "Community Learning Center",
    capacity: 40,
    registered: 25,
    status: "upcoming",
  }).returning();

  const event3 = await db.insert(events).values({
    title: "Food Distribution Drive",
    description: "Monthly food distribution program helping families in need with nutritious meals and groceries.",
    date: new Date("2025-12-25T10:00:00"),
    location: "Hope Foundation Center",
    capacity: 100,
    registered: 60,
    status: "upcoming",
  }).returning();

  console.log("Created events:", { event1, event2, event3 });

  const donation1 = await db.insert(donations).values({
    userId: donor1[0].id,
    amount: "100.00",
    donationType: "one-time",
    status: "completed",
    paymentId: "pay_demo_1",
    donorName: donor1[0].name,
    donorEmail: donor1[0].email,
  }).returning();

  const donation2 = await db.insert(donations).values({
    userId: donor2[0].id,
    amount: "250.00",
    donationType: "monthly",
    status: "completed",
    paymentId: "pay_demo_2",
    donorName: donor2[0].name,
    donorEmail: donor2[0].email,
  }).returning();

  const donation3 = await db.insert(donations).values({
    userId: donor1[0].id,
    amount: "50.00",
    donationType: "one-time",
    status: "completed",
    paymentId: "pay_demo_3",
    donorName: donor1[0].name,
    donorEmail: donor1[0].email,
  }).returning();

  console.log("Created donations:", { donation1, donation2, donation3 });

  const app1 = await db.insert(volunteerApplications).values({
    userId: volunteer1[0].id,
    name: volunteer1[0].name,
    email: volunteer1[0].email,
    phone: "(555) 123-4567",
    availability: "weekends",
    interests: ["Education & Tutoring", "Event Organization"],
    message: "I'm passionate about education and want to help in any way I can.",
    status: "approved",
  }).returning();

  const app2 = await db.insert(volunteerApplications).values({
    userId: volunteer2[0].id,
    name: volunteer2[0].name,
    email: volunteer2[0].email,
    phone: "(555) 234-5678",
    availability: "flexible",
    interests: ["Food Distribution", "Environmental Projects"],
    message: "I have experience with community outreach and would love to contribute.",
    status: "approved",
  }).returning();

  console.log("Created volunteer applications:", { app1, app2 });

  console.log("\nSeed completed successfully!");
  console.log("\nDemo user credentials:");
  console.log("Admin: admin@hopefoundation.org / password123");
  console.log("Volunteer 1: sarah@example.com / password123");
  console.log("Volunteer 2: michael@example.com / password123");
  console.log("Donor 1: emily@example.com / password123");
  console.log("Donor 2: david@example.com / password123");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
