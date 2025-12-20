// Import dépendances
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Import des Routes
import authRoutes from "./routes/auth.js"
import licenceRoutes from "./routes/licence.js"

const app = express()
app.use(cookieParser())

// ----- CORS ----- //// 
// Options des Control Origin Request Sharing ou CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));


app.use(express.json())

// ------ Appel des routes ------ //
app.use("/api/auth", authRoutes)
app.use("/api/licence", licenceRoutes)
// rajouter les autres 





app.get("/", (req,res) => {
    res.json("hello World")
})

app.listen(3000, () => {
    console.log("✅ BDD connectée !!!");
} )