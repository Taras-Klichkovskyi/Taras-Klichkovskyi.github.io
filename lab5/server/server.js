import express from "express"
import cors from "cors"
import admin from "firebase-admin"
import path from "path"
import { fileURLToPath } from "url"
import serviceAccount from "./serviceAccount.json" with { type: "json"}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientBuildPath = path.join(__dirname, "../client/build")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(clientBuildPath))

const DAY_IN_MS = 1000 * 60 * 60 * 24

const getRentalDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate)

  if (Number.isNaN(diff)) {
    return 1
  }

  return Math.max(1, Math.floor(diff / DAY_IN_MS) + 1)
}

const verifyTocken = async (req, res, next) => {
  try{
    const token = req.headers.authorization?.split("Bearer ")[1]
    if(!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const decodeToken = await admin.auth().verifyIdToken(token)
    req.user = decodeToken
    next()
} catch(error) {
    return res.status(403).json({ message: "Invalid or expired token " })
  }
}

app.get("/api/payment", verifyTocken, async(req, res) => {
  try {
    const userID = req.user.uid
    const minPrice = Number(req.query.minPrice)
    const maxPrice = Number(req.query.maxPrice)
    const hasMinPrice = req.query.minPrice !== undefined && !Number.isNaN(minPrice)
    const hasMaxPrice = req.query.maxPrice !== undefined && !Number.isNaN(maxPrice)
    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get()
    const data = []

    snapshot.forEach(doc => {
      const order = doc.data()
      const filteredItems = (order.items ?? []).filter((item) => {
        const itemPrice = Number(item.price) || 0
        const itemQuantity = Number(item.quantity) || 1
        const itemDays = getRentalDays(item.startDate, item.endDate)
        const itemTotalPrice = itemPrice * itemQuantity * itemDays

        if (hasMinPrice && itemTotalPrice < minPrice) {
          return false
        }

        if (hasMaxPrice && itemTotalPrice > maxPrice) {
          return false
        }

        return true
      })

      if (filteredItems.length === 0) {
        return
      }

      const filteredTotalPrice = filteredItems.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0
        const itemQuantity = Number(item.quantity) || 1
        const itemDays = getRentalDays(item.startDate, item.endDate)

        return sum + itemPrice * itemQuantity * itemDays
      }, 0)

      data.push({
        id: doc.id,
        ...order,
        items: filteredItems,
        totalPrice: filteredTotalPrice
      })
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/rentals", verifyTocken, async(req, res) => {
  try {
    const { fullName, phone, email, totalPrice, paymentLabel, items, createdAt} = req.body
    const userID = req.user.uid
    const docRef = await db.collection("users")
      .doc(userID)
      .collection("orders")
      .add({
        fullName,
        phone,
        email,
        totalPrice,
        paymentLabel,
        items,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    
    res.json({
      message: "Order added", id: docRef.id
    })
  } catch(error) {
    res.status(500).json({ error: error.message })
  }
})

app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"))
})

app.listen(5000, () => {
  console.log("Server is running on port 5000, http://localhost:5000")
})
