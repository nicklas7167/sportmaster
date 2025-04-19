import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { predictionStatus, insertPredictionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);

  // Get all predictions with optional filters
  app.get("/api/predictions", async (req, res) => {
    const status = req.query.status as string | undefined;
    const sportType = req.query.sportType as string | undefined;
    const type = req.query.type as string | undefined;
    const timeFrame = req.query.timeFrame as string | undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    try {
      const predictions = await storage.getPredictions({
        status,
        sportType,
        type,
        timeFrame,
        startDate,
        endDate
      });
      
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Create a new prediction (admin only)
  app.post("/api/predictions", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const validatedData = insertPredictionSchema.parse(req.body);
      const prediction = await storage.createPrediction(validatedData);
      res.status(201).json(prediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prediction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prediction" });
    }
  });

  // Update a prediction status (admin only)
  app.patch("/api/predictions/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid prediction ID" });
    }

    if (!predictionStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const updatedPrediction = await storage.updatePredictionStatus(id, status);
      if (!updatedPrediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }
      res.json(updatedPrediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update prediction" });
    }
  });

  // Delete a prediction (admin only)
  app.delete("/api/predictions/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid prediction ID" });
    }

    try {
      const success = await storage.deletePrediction(id);
      if (!success) {
        return res.status(404).json({ message: "Prediction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete prediction" });
    }
  });

  // Get prediction by ID
  app.get("/api/predictions/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid prediction ID" });
    }

    try {
      const prediction = await storage.getPredictionById(id);
      if (!prediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }
      
      // If prediction is premium and user is not premium or admin, blur sensitive data
      if (prediction.type === "premium" && 
          (!req.isAuthenticated() || (req.user.role !== "premium" && req.user.role !== "admin"))) {
        // Return limited data for premium predictions
        return res.json({
          ...prediction,
          prediction: "*****", // Blur the actual prediction
          notes: "*****",      // Blur notes too
          isPremiumLocked: true
        });
      }
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prediction" });
    }
  });

  // Seed initial admin user and sample predictions
  app.post("/api/seed", async (req, res) => {
    try {
      await storage.seedInitialData();
      res.status(200).json({ message: "Database seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
