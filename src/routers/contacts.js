import express from 'express';
import { Router } from "express";

import {
  getContactsController,
  getContactController,
  createContactController,
  deleteContactController,
  upsertContactController,
  updateContactController,
} from "../controllers/contacts.js";

import { upload } from "../middlewares/upload.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";

import { auth } from '../middlewares/auth.js';


const router = Router();
const jsonParser = express.json({
  type: 'application/json',
});
router.use(auth);

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(getContactController));
router.post(
  "/",
  upload.single("photo"),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));
router.put(
  "/:contactId",
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController)
);
router.patch(
  "/:contactId",
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(updateContactController)
);

export default router;
