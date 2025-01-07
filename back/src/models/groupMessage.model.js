import moongose from "mongoose";

const groupMessageSchema = new moongose.Schema(
    {
        communityId: {
            type: moongose.Schema.Types.ObjectId,
            ref: "Community",
            required: true
        },
        senderId: {
            type: moongose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
        },
        image: {
            type: String,
            default: ""
        },
        isReadBy: [
            {
                userId: {
                    type: moongose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                isRead: {
                    type: Boolean,
                    default: false
                },
                readAt: {
                    type: Date,
                    default: Date.now
                }
            }   
        ],
    },
    {
        timestamps: true
    }
);

const GroupMessage = moongose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;