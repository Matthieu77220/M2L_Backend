// Import dépendances
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

// Import des Routes
import authRoutes from "./routes/auth.js"
import ModifRoutes from "./routes/modifProfil.js"

const app = express()

// ----- CORS ----- //// 
// Options des Control Origin Request Sharing ou CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json())

// ------ Appel des routes ------ //
app.use("/api/auth", authRoutes)
app.use("/api/modifProfil", ModifRoutes)
// rajouter les autres 




app.get("/", (req,res) => {
    res.json("hello World")
})

app.listen(3000, () => {
    console.log("✅ BDD connectée !!! http://localhost:3000");
} )