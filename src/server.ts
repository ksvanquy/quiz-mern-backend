import app from './app';
import { PORT, MONGO_URI, verifySecretsLoaded } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {
  // Verify critical secrets are configured before starting
  verifySecretsLoaded();
  
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
