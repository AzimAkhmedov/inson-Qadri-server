import { Schema, model } from 'mongoose'

const AdminPassword = new Schema({
    hash: { type: String, required: true },
    username: { type: String, required: true }
});

export default model("AdminPassword", AdminPassword);
