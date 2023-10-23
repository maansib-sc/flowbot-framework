import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    sessionId: string;
    lastStep: number;
    chatbotId: string;
    subscriptionType: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    subscriptionType: {
        type: String,
        default: 'FREE'
    },
    chatbotId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    lastStep: {
        type: Number,
        default: 1
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

// UserSchema.index({ sessionId: 1 }, { unique: true });

let UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)


export const upsertUser = async (chatbotId: string, sessionId: string) => {
    const result = await UserModel.findOneAndUpdate(
        { sessionId },
        {
            $set: { sessionId, chatbotId },
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
