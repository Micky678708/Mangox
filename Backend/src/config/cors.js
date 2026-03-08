import cors from "cors";
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
dotenv.config();

const defaultOrigins = ["http://localhost:5173"];

const origin = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
  : defaultOrigins;

export default {
  origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
