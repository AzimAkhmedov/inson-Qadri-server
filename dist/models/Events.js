import { Schema, model } from 'mongoose';
const Events = new Schema({
    title: { type: String, required: true },
    description: {
        type: {
            text: { type: String },
            time: { type: String },
            date: { type: String },
            location: { type: String },
        },
    },
    needs: { type: (Array), required: true },
    contact: { type: String, required: true },
    img: { type: String, required: true }
});
export default model("Events", Events);
//# sourceMappingURL=Events.js.map