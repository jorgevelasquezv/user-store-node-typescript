import mongoose from "mongoose";

export class Validators{

    static isMongoId(id: string): boolean {
        return mongoose.isValidObjectId(id);
    }
}