import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.js";
import licenceRoutes from "./routes/licence.js";
import statistiqueAdherentRoutes from "./routes/statistiqueAdherent.js";
import superadminRoutes from "./routes/superadmin.js";
import profileRoutes from "./routes/profile.js";
import ModifRoutes from "./routes/modifProfil.js";
import terrainRoutes from "./routes/terrainAdmin.js";
import adminRoutes from "./routes/admin_routes.js";
import terrainAdherentRoutes from './routes/terrain_adherent.js'
import equipementRoutes from "./routes/equipement.js";
import abonnementRoutes from "./routes/abonnements.js";
import rejoindreMatchRoutes from "./routes/rejoindreMatch.js";
import voirClubRoutes from "./routes/voirClub.js"
import commentaireRoute from "./routes/commentaire_routes.js"


const app = express();

app.use(cookieParser());

// ----- CORS -----
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// ----- Middlewares -----
app.use(express.json());

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/licence", licenceRoutes);
app.use("/api/statistiqueAdherent", statistiqueAdherentRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/voirProfile", profileRoutes);
app.use("/api/modifProfil", ModifRoutes);
app.use("/api/admin", terrainRoutes);
app.use("/api/admin", adminRoutes) 
app.use("/api/equipement", equipementRoutes);
app.use("/api/abonnements", abonnementRoutes);
app.use("/api/terrain", terrainAdherentRoutes);
app.use("/api/rejoindreMatch", rejoindreMatchRoutes);
app.use("/api/club", voirClubRoutes);
app.use("/api/commentaire", commentaireRoute);

app.get("/", (req, res) => {
  res.json("hello World");
});

app.listen(3000, () => {
  console.log("✅ Serveur lancé : http://localhost:3000");
});
