import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const imageModel = mongoose.model("imageModels", imageSchema);

export default imageModel;
