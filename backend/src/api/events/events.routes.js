const express = require("express");
const { isAuthenticated, requireRole } = require("../../middlewares");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
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
      console.log(req.payload);
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
    const { page = 1, size = 10, search = "", category } = req.query;

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

module.exports = router;
