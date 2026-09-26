import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ContactMessage from "./models/ContactMessage.js";
import Product from "./models/Product.js";
import { requireAdmin } from "./middleware/auth.js";

const requiredEnvironment = ["MONGODB_URI", "JWT_SECRET", "ADMIN_EMAIL"];
const missingEnvironment = requiredEnvironment.filter(key => !process.env[key]);
if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) missingEnvironment.push("ADMIN_PASSWORD or ADMIN_PASSWORD_HASH");
if (missingEnvironment.length) throw new Error(`Missing environment variables: ${missingEnvironment.join(", ")}`);

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const asyncHandler = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false });

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by the API."));
  }
}));
app.use(express.json({ limit: "1mb" }));

let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

function normaliseList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean).slice(0, 20);
  return String(value || "").split(",").map(item => item.trim()).filter(Boolean).slice(0, 20);
}

function productPayload(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const image = String(body.image || "").trim();
  const description = String(body.description || "").trim();
  const price = Number(body.price);

  if (!name || !category || !image || !description || !Number.isFinite(price)) {
    const error = new Error("Name, category, image, description and a valid price are required.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    name,
    category,
    price,
    oldPrice: Number.isFinite(Number(body.oldPrice)) ? Number(body.oldPrice) : undefined,
    rating: Number.isFinite(Number(body.rating)) ? Number(body.rating) : 0,
    reviews: String(body.reviews || "0").trim(),
    badge: String(body.badge || "PICK").trim(),
    deal: String(body.deal || "").trim(),
    image,
    description,
    specs: normaliseList(body.specs),
    bestFor: String(body.bestFor || "").trim(),
    pros: normaliseList(body.pros),
    consider: String(body.consider || "").trim(),
    outboundUrl: String(body.outboundUrl || "").trim(),
    isPublished: !(body.isPublished === false || body.isPublished === "false")
  };

  if (Number.isInteger(Number(body.legacyId))) payload.legacyId = Number(body.legacyId);
  return payload;
}

function findProductQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) return { _id: id };
  if (/^\d+$/.test(id)) return { legacyId: Number(id) };
  return null;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.post("/api/auth/login", loginLimiter, asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const validEmail = email === String(process.env.ADMIN_EMAIL).trim().toLowerCase();
  const validPassword = adminPasswordHash ? await bcrypt.compare(password, adminPasswordHash) : false;

  if (!validEmail || !validPassword) return res.status(401).json({ message: "Invalid admin email or password." });

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "8h" });
  return res.json({ token, admin: { email } });
}));

app.get("/api/products", asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 24, 1), 100);
  const filter = { isPublished: true };
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.q) filter.name = { $regex: String(req.query.q), $options: "i" };

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Product.countDocuments(filter)
  ]);
  return res.json({ items, total, page, pageSize });
}));

app.get("/api/products/:id", asyncHandler(async (req, res) => {
  const query = findProductQuery(req.params.id);
  if (!query) return res.status(400).json({ message: "Invalid product id." });
  const product = await Product.findOne({ ...query, isPublished: true }).lean();
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
}));

app.post("/api/contact", asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const topic = String(req.body.topic || "General").trim();
  const message = String(req.body.message || "").trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return res.status(400).json({ message: "Please provide a valid name, email and message." });
  }
  await ContactMessage.create({ name, email, topic, message });
  return res.status(201).json({ message: "Message received." });
}));

app.use("/api/admin", requireAdmin);

app.get("/api/admin/stats", asyncHandler(async (req, res) => {
  const [products, published, newMessages] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isPublished: true }),
    ContactMessage.countDocuments({ status: "new" })
  ]);
  return res.json({ products, published, newMessages });
}));

app.get("/api/admin/products", asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ updatedAt: -1 }).lean();
  return res.json({ items: products });
}));

app.post("/api/admin/products", asyncHandler(async (req, res) => {
  const product = await Product.create(productPayload(req.body));
  return res.status(201).json(product);
}));

app.put("/api/admin/products/:id", asyncHandler(async (req, res) => {
  const query = findProductQuery(req.params.id);
  if (!query) return res.status(400).json({ message: "Invalid product id." });
  const product = await Product.findOneAndUpdate(query, productPayload(req.body), { new: true, runValidators: true }).lean();
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
}));

app.delete("/api/admin/products/:id", asyncHandler(async (req, res) => {
  const query = findProductQuery(req.params.id);
  if (!query) return res.status(400).json({ message: "Invalid product id." });
  const product = await Product.findOneAndDelete(query);
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.status(204).send();
}));

app.get("/api/admin/messages", asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();
  return res.json({ items: messages });
}));

app.patch("/api/admin/messages/:id", asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid message id." });
  const status = ["new", "read", "archived"].includes(req.body.status) ? req.body.status : "read";
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!message) return res.status(404).json({ message: "Message not found." });
  return res.json(message);
}));

app.use((error, req, res, next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: statusCode === 500 ? "Something went wrong on the server." : error.message });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  if (!adminPasswordHash && process.env.ADMIN_PASSWORD) adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  app.listen(port, () => console.log(`genztechco API listening on port ${port}`));
}

start().catch(error => {
  console.error("Unable to start genztechco API.", error);
  process.exitCode = 1;
});
