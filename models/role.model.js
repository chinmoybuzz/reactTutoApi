const { modelObjectId } = require("mongoose");
const { Status } = require("../helper/typeConfig");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      required: [true, "Name is required"],
    },
    code: {
      type: String,
      default: null
    },
    adminRole: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Number,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    deletedAt: { type: Date, default: null },
    createdBy: {
      type: ObjectId,
      ref: "users",
      default: null,
    },
    updatedBy: {
      type: ObjectId,
      ref: "users",
      default: null,
    },
    deletedBy: {
      type: ObjectId,
      ref: "users",
      default: null,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

modelSchema.plugin(mongooseAggregatePaginate);
module.exports = model("roles", modelSchema);
