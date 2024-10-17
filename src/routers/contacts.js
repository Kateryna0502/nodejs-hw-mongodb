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

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", ctrlWrapper(getContactController));
router.post("/", ctrlWrapper(createContactController));
router.delete("/:contactId", ctrlWrapper(deleteContactController));
router.put("/:contactId", ctrlWrapper(upsertContactController));
router.patch("/:contactId", ctrlWrapper(updateContactController));

export default router;
