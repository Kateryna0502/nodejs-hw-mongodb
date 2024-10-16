import { Router } from "express";

import {
  getContactsController,
  getContactController,
  createContactController,
  deleteContactController,
  upsertContactController,
  updateContactController,
} from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
const router = Router();

router.get("/contacts", ctrlWrapper(getContactsController));
router.get("/contacts/:contactId", ctrlWrapper(getContactController));
router.post("/contacts", ctrlWrapper(createContactController));
router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));
router.put("/contacts/:contactId", ctrlWrapper(upsertContactController));
router.patch("/contacts/:contactId", ctrlWrapper(updateContactController));

export default router;
