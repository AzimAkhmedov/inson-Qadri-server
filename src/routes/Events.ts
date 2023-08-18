import { Router } from 'express'
const router = Router()
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

import { Event } from '../controllers/index.js'
router.post('/auth/admin', Event.login)
router.post("/", upload.single("filename"), Event.createEvent)
router.get("/", Event.getEvents)
router.delete("/delete/:id", Event.deleteEvent)
router.get("/:id", Event.getCurrentEvent)
router.put('/update/', Event.updateEvent)

export default router;
