require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const lazyRoutes = require('./routes/lazy.routes');

const nodeRoutes = require('./routes/node.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const questionRoutes = require('./routes/question.routes');
const answerRoutes = require('./routes/answer.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/nodes', nodeRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/lazy', lazyRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
