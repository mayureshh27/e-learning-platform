import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info({ msg: `🚀 Server running in ${process.env.NODE_ENV} mode`, port: PORT });
    });
}).catch((err) => {
    logger.error({ msg: 'Failed to connect to database', error: err });
    process.exit(1);
});
