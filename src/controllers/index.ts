import { Request, Response } from 'express'
import { EventModel, AdminPassword } from '../models/index.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret } from '../config.js';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../config.js';

initializeApp(firebaseConfig);
const storage = getStorage();

const giveCurrentDateTime = () => {
    const today = new Date();
    const date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
};

const generateAccessToken = (username: string, password: string) => {
    const payload = { username, password };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

const tokenValidation = async (token: string) => {
    const adminPassword = await AdminPassword.find()
    const decoded = jwt.decode(token)
    if (!token) return false
    if (typeof decoded !== 'string') {
        const isValid = adminPassword[0].hash === decoded.password
        const isValidUsername = decoded.username === adminPassword[0].username
        return isValid && isValidUsername
    }
}
class EventController {
    async login(req: Request, res: Response) {
        const { username, password } = req.body
        console.log(username, password);

        const adminPassword = await AdminPassword.find()
        if (username !== adminPassword[0].username) {
            return res.status(400).json({
                message: "Wrong fool!"
            })
        }
        const isValid = bcrypt.compareSync(password, adminPassword[0].hash);
        if (!isValid) {
            return res.status(400).json({
                message: "Wrong fool!"
            })
        }
        return res.json({
            token: generateAccessToken(username, adminPassword[0].hash)
        })
    }
    async createEvent(req: Request, res: Response) {
        try {
            const { token } = req.headers
            console.log(await tokenValidation(token as string));

            if (!await tokenValidation(token as string)) {
                return res.status(400).json({ message: " No rights!" })
            }
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(
                storage,
                `files/${req.file.originalname + "       " + dateTime}`
            );
            const metadata = {
                contentType: req.file.mimetype,
            };
            const snapshot = await uploadBytesResumable(
                storageRef,
                req.file.buffer,
                metadata
            );
            const downloadURL = await getDownloadURL(snapshot.ref);

            const { title, contact, needs, description } = req.body;

            const event = new EventModel({
                title, contact,
                needs: JSON.parse(needs),
                description: JSON.parse(description),
                img: downloadURL
            });
            await event.save();
            return res.json(event);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }
    async updateEvent(req: Request, res: Response) {
        const { token } = req.headers
        if (!tokenValidation(token as string)) {
            return res.status(400).json({ message: " No rights!" })
        }
        const { id, contact, needs, title, description } = req.body
        const event = await EventModel.findById(id)
        if (!event) {
            return res.status(400).json({ message: "No such event" })
        }
        const newEvent = {
            contact, img: event.img, needs, title, description
        }
        await event.replaceOne(newEvent)
        return res.json({ message: "Success" })
    }
    async deleteEvent(req: Request, res: Response) {
        const { token } = req.headers
        if (!tokenValidation(token as string)) {
            return res.status(400).json({ message: " No rights!" })
        }
        const { id } = req.params
        const event = await EventModel.findById(id)

        if (!event) {
            console.log(event);

            return res.status(400).json({ message: "No such event" })
        }
        const reference = ref(storage, event.img)
        deleteObject(reference)
            .then((res) => { })
            .catch((e) => {
                return res.status(400).json({ message: "Ошибка удаления фотографии" });
            });
        await event.deleteOne()
        return res.json({ message: "success" })
    }
    async getCurrentEvent(req: Request, res: Response) {
        const { id } = req.params
        const event = await EventModel.findById(id)
        return res.json(event)
    }
    async getEvents(req: Request, res: Response) {
        const events = await EventModel.find()
        return res.json(events)
    }
}

export const Event = new EventController();
