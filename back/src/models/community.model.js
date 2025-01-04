import moongose from "mongoose";

const communitySchema = new moongose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        creatorId: {
            type: moongose.Schema.Types.ObjectId,
            ref: "User",
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        requestsToJoin: [
            {
                userId: {
                    type: moongose.Schema.Types.ObjectId,
                    ref: "User"
                },
                requestedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        description: {
            type: String,
            default: ""
        },
        photoUrl: {
            type: String,
            default: ""
        },
        tags: [
            {
                type: moongose.Schema.Types.ObjectId,
                required: true,
                unique: true,
                ref: "Tag"
            }
        ],
        members: [
            {
                userId: {
                    type: moongose.Schema.Types.ObjectId,
                    ref: "User"
                },
                joinedAt: {
                    type: Date,
                    default: Date.now
                },
                role: {
                    type: String,
                    enum: ["admin", "member", "moderator"],
                    default: "member"
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Community = moongose.model("Community", communitySchema);

export default Community;