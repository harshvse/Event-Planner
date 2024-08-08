const { isAuthenticated } = require("../../middlewares");
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Book an event
router.post("/add", isAuthenticated, async (req, res) => {
  const { eventId, quantity } = req.body;
  const userId = req.payload.userId;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const totalAmount = (parseFloat(event.price) * quantity).toString();

    const order = await prisma.order.create({
      data: {
        eventId,
        quantity,
        totalAmount,
        stripeId: "mock_stripe_id", // Replace with actual Stripe integration
        buyerId: userId,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch user orders
router.get("/orders", isAuthenticated, async (req, res) => {
  const userId = req.payload.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: { event: true },
    });

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
