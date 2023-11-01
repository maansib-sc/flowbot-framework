import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    lastStep: number;
    chatbotId: string;
    sessionId: string;
    subscriptionType: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    subscriptionType: {
        type: String,
        default: 'FREE'
    },
    sessionId: {
        type: String,
        required: true
    },
    chatbotId: {
        type: String,
        required: true
    },
    lastStep: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // This will disable the __v field
});


let UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)


export const upsertUser = async (chatbotId: string, sessionId: string) => {
    const result = await UserModel.findOneAndUpdate(
        { sessionId },
        {
            $setOnInsert: { sessionId, chatbotId },
            $inc: { lastStep: 1 }, // Increment lastStep by 1
            $currentDate: { updatedAt: true }
        },
        {
            new: true, // return the new document rather than the old one
            upsert: true, // insert the document if it does not exist
        }
    );
    return result;
}

export default UserModel;
