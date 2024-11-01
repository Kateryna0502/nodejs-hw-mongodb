import httpError from "http-errors";

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from "../services/contacts.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

export async function getContactsController(req, res, next) {
  try {
    const { page = 1, perPage = 10 } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const data = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export const getContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const contact = await getContactById(contactId);
    if (!contact || contact.userId.toString() !== userId) {
      throw httpError(404, "Contact not found");
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contact = await createContact(userId, req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const contact = await deleteContact(userId, contactId);
    if (!contact) {
      throw httpError(404, "Contact not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const result = await updateContact(userId, contactId, req.body, { upsert: true });
    if (!result) {
      throw httpError(404, "Contact not found");
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: `Successfully upserted a contact!`,
      data: result,  
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id.toString();

    const result = await updateContact(userId, contactId, req.body);
    if (!result) {
      throw httpError(404, "Contact not found");
    }
    res.status(200).json({
      status: 200,
      message: `Successfully updated a contact!`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
