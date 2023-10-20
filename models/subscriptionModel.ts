import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
    chatbotId: string;
    subscriptionType: string;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
    subscriptionType: {
        type: String,
        default: 'FREE'
    },
    chatbotId: {
        type: String,
        required: true
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

SubscriptionSchema.index({ chatbotId: 1 }, { unique: true });

let SubscriptionModel = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema)


export const upsertSubscription = async (chatbotId: string) => {
    const result = await SubscriptionModel.findOneAndUpdate(
        { chatbotId },
        {
            $setOnInsert: { chatbotId },
            $currentDate: { updatedAt: true }
        },
        {
            new: true, // return the new document rather than the old one
            upsert: true, // insert the document if it does not exist
        }
    );
    return result;
}

export default SubscriptionModel;
