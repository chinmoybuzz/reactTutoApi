const { Schema, model,ObjectId } = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");
// const { locationSchema: AddressSchema, tagSchema } = require("./helperSchema");
const { Status } = require("../helper/typeConfig");

const userSchema = new Schema(
  {
    name: { type: String, default: null },
    email: {
      type: String,
      default: null,
    },
    password: { type: String, default: null },
    website_url: { type: String, default: null },
    roleId: {
      type: [ObjectId],
      ref: "roles",
      default: null,
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

userSchema.plugin(mongoosePaginate);
module.exports = model("users", userSchema);
