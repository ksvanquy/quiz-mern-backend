import app from './app';
import { PORT, MONGO_URI } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
