const mongoose = require('mongoose');

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }
};
