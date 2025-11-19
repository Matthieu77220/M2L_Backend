// Import dépendances ET fonctionnalitées
import express from "express"
import cors from "cors"

// Import des Routes
import authRoutes from "./routes/auth.js"

const app = express()

// ----- CORS ----- //// 
// Options des Control Origin Request Sharing ou CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));


app.use(express.json())

// Appel des routes
app.use("/api/auth", authRoutes)





app.get("/", (req,res) => {
    res.json("hello World")
})

app.listen(3000, () => {
    console.log("✅ BDD connectée !!!");
} )