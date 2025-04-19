import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["free", "premium", "admin"] }).default("free").notNull(),
  subscriptionEnd: timestamp("subscription_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Prediction schema
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  matchTitle: text("match_title").notNull(),
  league: text("league").notNull(),
  sportType: text("sport_type").notNull(),
  startTime: timestamp("start_time").notNull(),
  prediction: text("prediction").notNull(),
  odds: text("odds").notNull(),
  type: text("type", { enum: ["free", "premium"] }).notNull(),
  status: text("status", { enum: ["upcoming", "won", "lost", "void"] }).default("upcoming").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Status options
export const predictionStatus = ["upcoming", "won", "lost", "void"] as const;
export type PredictionStatus = typeof predictionStatus[number];

// Type options
export const predictionTypes = ["free", "premium"] as const;
export type PredictionType = typeof predictionTypes[number];

// Sport types
export const sportTypes = ["football", "basketball", "tennis", "hockey", "other"] as const;
export type SportType = typeof sportTypes[number];

// User roles
export const userRoles = ["free", "premium", "admin"] as const;
export type UserRole = typeof userRoles[number];
