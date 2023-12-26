import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    lastStep: number;
    chatbotId: string;
    sessionId: string;
    subscriptionType: string;
    userData: any[];
    createdAt: Date;
    updatedAt: Date;
}

interface stepData {
    key: string;
    category_id?: string;
    category_description?: string;
    answer?: string;
}

const UserSchema: Schema = new Schema({
    subscriptionType: {
        type: String,
        default: 'FREE',
    },
    sessionId: {
        type: String,
        required: true,
    },
    chatbotId: {
        type: String,
        required: true,
    },
    lastStep: {
        type: Number,
        default: 0,
    },
    userData: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});

UserSchema.methods.getlastStep = function () {
    return this.lastStep;
};

UserSchema.method('setlastStep', function (value: number) {
    this.lastStep = value;
});

UserSchema.method("setUserData", function (data: stepData) {
    const index = this.userData.findIndex((item: stepData) => item.key === data.key);
    if (index !== -1) {
        this.userData[index] = data;
    } else {
        this.userData.push(data);
    }
});

UserSchema.method("getUserData", function () {
    return this.userData
});

UserSchema.method("getData", function (value: string) {
    return this.userData.find((item: stepData) => item.key == value)
});

export let UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const upsertUser = async (chatbotId: string, sessionId: string) => {
    const result = await UserModel.findOneAndUpdate(
        { sessionId },
        {
            $setOnInsert: { sessionId, chatbotId },
            $currentDate: { updatedAt: true }
        },
        {
            new: true, // return the new document rather than the old one
            upsert: true, // insert the document if it does not exist
        }
    );
    if (result instanceof UserModel) {
        return result;
    } else {
        return new UserModel(result);
    }
}

export default UserModel;
