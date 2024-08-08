const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

router.post(
  "/create",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        location,
        imageUrl,
        startDateTime,
        endDateTime,
        price,
        isFree,
        url,
        categoryName,
      } = req.body;

      // Find or create the category
      let category = await prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName },
        });
      }
      // Create the event with the category ID
      const event = await prisma.event.create({
        data: {
          title,
          description,
          location,
          imageUrl,
          startDateTime: new Date(startDateTime),
          endDateTime: new Date(endDateTime),
          price,
          isFree: isFree === "true",
          url,
          categoryId: category.id,
          organizerId: req.payload.userId,
        },
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/events", async (req, res) => {
  try {
    const { page = 1, size = 9, search = "", category } = req.query;

    let isAdmin = false;

    // Check if the user is authenticated
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        isAdmin = decodedToken.roles[0] === "Admin";
      } catch (error) {
        return res.status(401).json({ error: error + " Invalid token" });
      }
    }

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category ? { categoryId: category } : {},
      ],
    };

    // Only add the isHidden filter if the user is not an admin
    if (!isAdmin) {
      where.AND.push({ isHidden: false });
    }

    const events = await prisma.event.findMany({
      where,
      skip: (page - 1) * size,
      take: parseInt(size),
      include: {
        category: true,
        organizer: true,
      },
    });

    const totalEvents = await prisma.event.count({ where });

    res.json({
      events,
      total: totalEvents,
      page: parseInt(page),
      size: parseInt(size),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get event by ID
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        category: true,
        organizer: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put(
  "/:eventId",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const {
        title,
        description,
        location,
        imageUrl,
        startDateTime,
        endDateTime,
        price,
        isFree,
        url,
        categoryName,
        isHidden,
      } = req.body;
      // Find or create the category
      let category = await prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName },
        });
      }
      // Update the event
      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          title,
          description,
          location,
          imageUrl,
          startDateTime: new Date(startDateTime),
          endDateTime: new Date(endDateTime),
          price: isFree ? "0" : price,
          isHidden,
          isFree,
          url,
          categoryId: category.id,
          organizerId: req.payload.userId,
        },
      });

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Soft delete event
router.get(
  "/hide/:eventId",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const { eventId } = req.params;

      // Soft delete the event by setting isHidden to true
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { isHidden: true },
      });

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Soft delete event
router.get(
  "/unhide/:eventId",
  isAuthenticated,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const { eventId } = req.params;

      // Soft delete the event by setting isHidden to true
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { isHidden: false },
      });

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
