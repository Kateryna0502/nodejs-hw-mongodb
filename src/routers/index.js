// import express from 'express';

// import { auth } from '../middlewares/auth.js';

// import authRoutes from './auth.js';
// import contactsRoutes from './contacts.js';

// const router = express.Router();

// router.use('/auth', authRoutes);
// router.use('/contacts', auth, contactsRoutes);

// export default router;
import express from 'express';
import authRoutes from './auth.js';
import contactsRoutes from './contacts.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', auth, contactsRoutes);

export default router;
