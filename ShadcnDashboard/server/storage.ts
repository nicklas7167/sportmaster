import { 
  User, 
  InsertUser, 
  Prediction, 
  InsertPrediction,
  PredictionStatus,
  userRoles,
  users,
  predictions
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db, supabase } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const scryptAsync = promisify(scrypt);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string, subscriptionEnd?: Date): Promise<User>;
  
  getPredictions(filters?: {
    status?: string;
    sportType?: string;
    type?: string;
    timeFrame?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Prediction[]>;
  getPredictionById(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePredictionStatus(id: number, status: PredictionStatus): Promise<Prediction | undefined>;
  deletePrediction(id: number): Promise<boolean>;
  seedInitialData(): Promise<void>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Using memory store since session persistence is separate from data persistence
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          role: insertUser.role || "free",
          subscriptionEnd: null,
          createdAt: new Date()
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUserRole(id: number, role: string, subscriptionEnd?: Date): Promise<User> {
    if (!userRoles.includes(role as any)) {
      throw new Error("Invalid role");
    }

    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          role: role as any,
          subscriptionEnd: subscriptionEnd || null
        })
        .where(eq(users.id, id))
        .returning();
      
      if (!updatedUser) {
        throw new Error("User not found");
      }
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  async getPredictions(filters?: {
    status?: string;
    sportType?: string;
    type?: string;
    timeFrame?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Prediction[]> {
    try {
      let queryBuilder = db.select().from(predictions);
      let whereConditions: any[] = [];
      
      if (filters) {
        if (filters.status) {
          whereConditions.push(eq(predictions.status as any, filters.status as any));
        }
        
        if (filters.sportType) {
          whereConditions.push(eq(predictions.sportType, filters.sportType));
        }
        
        if (filters.type) {
          whereConditions.push(eq(predictions.type as any, filters.type as any));
        }
        
        if (filters.timeFrame) {
          const now = new Date();
          const today = new Date(now.setHours(0, 0, 0, 0));
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          
          switch (filters.timeFrame) {
            case 'today':
              whereConditions.push(gte(predictions.startTime, today));
              whereConditions.push(lte(predictions.startTime, tomorrow));
              break;
            case 'tomorrow':
              const dayAfterTomorrow = new Date(tomorrow);
              dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
              whereConditions.push(gte(predictions.startTime, tomorrow));
              whereConditions.push(lte(predictions.startTime, dayAfterTomorrow));
              break;
            case 'thisWeek':
              whereConditions.push(gte(predictions.startTime, today));
              whereConditions.push(lte(predictions.startTime, nextWeek));
              break;
          }
        }
        
        if (filters.startDate) {
          whereConditions.push(gte(predictions.startTime, filters.startDate));
        }
        
        if (filters.endDate) {
          whereConditions.push(lte(predictions.startTime, filters.endDate));
        }
      }
      
      // Apply conditions if there are any
      if (whereConditions.length > 0) {
        queryBuilder = queryBuilder.where(and(...whereConditions));
      }
      
      // Sort by startTime in ascending order (upcoming first)
      const result = await queryBuilder.orderBy(predictions.startTime);
      return result;
    } catch (error) {
      console.error("Error getting predictions:", error);
      return [];
    }
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    try {
      const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
      return prediction;
    } catch (error) {
      console.error("Error getting prediction by ID:", error);
      return undefined;
    }
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    try {
      const [newPrediction] = await db
        .insert(predictions)
        .values({
          ...prediction,
          // Ensure status is never undefined
          status: prediction.status || "upcoming",
          createdAt: new Date()
        })
        .returning();
      
      return newPrediction;
    } catch (error) {
      console.error("Error creating prediction:", error);
      throw error;
    }
  }

  async updatePredictionStatus(id: number, status: PredictionStatus): Promise<Prediction | undefined> {
    try {
      const [updatedPrediction] = await db
        .update(predictions)
        .set({ status })
        .where(eq(predictions.id, id))
        .returning();
      
      return updatedPrediction;
    } catch (error) {
      console.error("Error updating prediction status:", error);
      return undefined;
    }
  }

  async deletePrediction(id: number): Promise<boolean> {
    try {
      await db
        .delete(predictions)
        .where(eq(predictions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting prediction:", error);
      return false;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async seedInitialData(): Promise<void> {
    try {
      // Create admin user if it doesn't exist
      const adminUsername = "admin";
      const existingAdmin = await this.getUserByUsername(adminUsername);
      
      if (!existingAdmin) {
        const adminPassword = await this.hashPassword("admin123");
        await db.insert(users).values({
          username: adminUsername,
          password: adminPassword,
          role: "admin",
          subscriptionEnd: null,
          createdAt: new Date()
        });
      }
      
      // Only seed predictions if there are none
      const existingPredictions = await db.select().from(predictions);
      
      if (existingPredictions.length === 0) {
        const now = new Date();
        const today = new Date(now);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(now);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        
        // Sample predictions
        const samplePredictions = [
          {
            matchTitle: "Manchester City vs Real Madrid",
            league: "Champions League",
            sportType: "football",
            startTime: new Date(today.setHours(20, 45, 0, 0)),
            prediction: "Both Teams to Score",
            odds: "1.75",
            type: "free" as const,
            status: "upcoming" as const,
            notes: "Both teams have strong attacking options and have been scoring consistently.",
            createdAt: new Date()
          },
          {
            matchTitle: "Liverpool vs Arsenal",
            league: "Premier League",
            sportType: "football",
            startTime: new Date(tomorrow.setHours(18, 30, 0, 0)),
            prediction: "Over 2.5 & BTTS",
            odds: "2.10",
            type: "premium" as const,
            status: "upcoming" as const,
            notes: "Historical data shows high-scoring matches between these two teams.",
            createdAt: new Date()
          },
          {
            matchTitle: "Bayern Munich vs Dortmund",
            league: "Bundesliga",
            sportType: "football",
            startTime: new Date(yesterday.setHours(19, 0, 0, 0)),
            prediction: "Bayern Munich to Win",
            odds: "1.55",
            type: "free" as const,
            status: "won" as const,
            notes: "Bayern's home record against Dortmund is very strong.",
            createdAt: new Date()
          },
          {
            matchTitle: "Lakers vs Warriors",
            league: "NBA",
            sportType: "basketball",
            startTime: new Date(today.setHours(3, 30, 0, 0)),
            prediction: "Warriors +3.5",
            odds: "1.90",
            type: "free" as const,
            status: "upcoming" as const,
            notes: "Warriors have been performing well on the road this season.",
            createdAt: new Date()
          },
          {
            matchTitle: "Djokovic vs Nadal",
            league: "Tennis - ATP",
            sportType: "tennis",
            startTime: new Date(yesterday.setHours(16, 0, 0, 0)),
            prediction: "Nadal to Win",
            odds: "2.25",
            type: "premium" as const,
            status: "lost" as const,
            notes: "Nadal's form on clay courts is historically exceptional.",
            createdAt: new Date()
          },
          {
            matchTitle: "Juventus vs Inter Milan",
            league: "Serie A",
            sportType: "football",
            startTime: new Date(dayAfterTomorrow.setHours(19, 45, 0, 0)),
            prediction: "Under 2.5 Goals",
            odds: "1.85",
            type: "free" as const,
            status: "void" as const,
            notes: "Both teams have strong defenses and matches between them tend to be low-scoring.",
            createdAt: new Date()
          }
        ];
        
        await db.insert(predictions).values(samplePredictions);
      }
    } catch (error) {
      console.error("Error seeding initial data:", error);
      throw error;
    }
  }
}

// In-memory storage implementation for fallback
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  sessionStore: session.Store;
  private userCounter: number;
  private predictionCounter: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    this.userCounter = 1;
    this.predictionCounter = 1;
    
    // Seed initial data automatically on construction
    this.seedInitialData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = {
      id,
      ...insertUser,
      role: insertUser.role || "free",
      subscriptionEnd: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(id: number, role: string, subscriptionEnd?: Date): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (!userRoles.includes(role as any)) {
      throw new Error("Invalid role");
    }

    const updatedUser: User = {
      ...user,
      role: role as any,
      subscriptionEnd: subscriptionEnd || null
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPredictions(filters?: {
    status?: string;
    sportType?: string;
    type?: string;
    timeFrame?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Prediction[]> {
    let predictions = Array.from(this.predictions.values());
    
    if (filters) {
      if (filters.status) {
        predictions = predictions.filter(p => p.status === filters.status);
      }
      
      if (filters.sportType) {
        predictions = predictions.filter(p => p.sportType === filters.sportType);
      }
      
      if (filters.type) {
        predictions = predictions.filter(p => p.type === filters.type);
      }
      
      if (filters.timeFrame) {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        switch (filters.timeFrame) {
          case 'today':
            predictions = predictions.filter(p => 
              p.startTime >= today && p.startTime < tomorrow
            );
            break;
          case 'tomorrow':
            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
            predictions = predictions.filter(p => 
              p.startTime >= tomorrow && p.startTime < dayAfterTomorrow
            );
            break;
          case 'thisWeek':
            predictions = predictions.filter(p => 
              p.startTime >= today && p.startTime < nextWeek
            );
            break;
        }
      }
      
      if (filters.startDate) {
        predictions = predictions.filter(p => p.startTime >= filters.startDate!);
      }
      
      if (filters.endDate) {
        predictions = predictions.filter(p => p.startTime <= filters.endDate!);
      }
    }
    
    // Sort by startTime
    return predictions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.predictionCounter++;
    const newPrediction: Prediction = {
      id,
      ...prediction,
      status: prediction.status || "upcoming",
      createdAt: new Date()
    };
    this.predictions.set(id, newPrediction);
    return newPrediction;
  }

  async updatePredictionStatus(id: number, status: PredictionStatus): Promise<Prediction | undefined> {
    const prediction = await this.getPredictionById(id);
    if (!prediction) {
      return undefined;
    }
    
    const updatedPrediction: Prediction = {
      ...prediction,
      status
    };
    
    this.predictions.set(id, updatedPrediction);
    return updatedPrediction;
  }

  async deletePrediction(id: number): Promise<boolean> {
    return this.predictions.delete(id);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async seedInitialData(): Promise<void> {
    // Only seed if no data exists
    if (this.users.size === 0 && this.predictions.size === 0) {
      // Create admin user
      const adminPassword = await this.hashPassword("admin123");
      await this.createUser({
        username: "admin",
        password: adminPassword,
        role: "admin" as const
      });
      
      // Create sample predictions
      const now = new Date();
      const today = new Date(now);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(now);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      
      const samplePredictions: InsertPrediction[] = [
        {
          matchTitle: "Manchester City vs Real Madrid",
          league: "Champions League",
          sportType: "football",
          startTime: new Date(today.setHours(20, 45, 0, 0)),
          prediction: "Both Teams to Score",
          odds: "1.75",
          type: "free",
          status: "upcoming",
          notes: "Both teams have strong attacking options and have been scoring consistently."
        },
        {
          matchTitle: "Liverpool vs Arsenal",
          league: "Premier League",
          sportType: "football",
          startTime: new Date(tomorrow.setHours(18, 30, 0, 0)),
          prediction: "Over 2.5 & BTTS",
          odds: "2.10",
          type: "premium",
          status: "upcoming",
          notes: "Historical data shows high-scoring matches between these two teams."
        },
        {
          matchTitle: "Bayern Munich vs Dortmund",
          league: "Bundesliga",
          sportType: "football",
          startTime: new Date(yesterday.setHours(19, 0, 0, 0)),
          prediction: "Bayern Munich to Win",
          odds: "1.55",
          type: "free",
          status: "won",
          notes: "Bayern's home record against Dortmund is very strong."
        },
        {
          matchTitle: "Lakers vs Warriors",
          league: "NBA",
          sportType: "basketball",
          startTime: new Date(today.setHours(3, 30, 0, 0)),
          prediction: "Warriors +3.5",
          odds: "1.90",
          type: "free",
          status: "upcoming",
          notes: "Warriors have been performing well on the road this season."
        },
        {
          matchTitle: "Djokovic vs Nadal",
          league: "Tennis - ATP",
          sportType: "tennis",
          startTime: new Date(yesterday.setHours(16, 0, 0, 0)),
          prediction: "Nadal to Win",
          odds: "2.25",
          type: "premium",
          status: "lost",
          notes: "Nadal's form on clay courts is historically exceptional."
        },
        {
          matchTitle: "Juventus vs Inter Milan",
          league: "Serie A",
          sportType: "football",
          startTime: new Date(dayAfterTomorrow.setHours(19, 45, 0, 0)),
          prediction: "Under 2.5 Goals",
          odds: "1.85",
          type: "free",
          status: "void",
          notes: "Both teams have strong defenses and matches between them tend to be low-scoring."
        }
      ];
      
      for (const predictionData of samplePredictions) {
        await this.createPrediction(predictionData);
      }
    }
  }
}

// Using in-memory storage temporarily until we resolve Supabase connection issues
export const storage = new MemStorage();