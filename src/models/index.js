import mongoose from 'mongoose';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_URL);
};

// const models = { User, Message };

export { connectDb };

// export default models;