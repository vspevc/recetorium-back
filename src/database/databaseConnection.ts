import mongoose from "mongoose";

const databaseConnect = async (mongoUrl: string) => {
  await mongoose.connect(mongoUrl);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret.id = ret._id;

      delete ret._id;
      delete ret.__v;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ret;
    },
  });
};

export default databaseConnect;
