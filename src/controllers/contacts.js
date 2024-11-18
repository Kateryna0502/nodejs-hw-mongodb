import mongoose from "mongoose";
import createHttpError from "http-errors";
import fs from "node:fs/promises";

import path from "node:path";
// import httpError from "http-errors";

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


import { env } from "../utils/env.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export async function getContactsController(req, res, next) {
  const userId = req.user._id;
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
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully found contact with id {contactId}!",
    data: contact,
  });
};

// export const createContactController = async (req, res) => {
//   const { name, phoneNumber, email, isFavourite, contactType } = req.body;
//   let photo = null;

//   if (typeof req.file !== "undefined") {
//     if (process.env.ENABLE_CLOUDINARY === "true") {
//       const result = await uploadToCloudinary(req.file.path);
//       await fs.unlink(req.file.path);

//       photo = result.secure_url;
//     }
//   } else {
//     await fs.rename(
//       req.file.path,
//       path.resolve("src", "public/photo", req.file.filename)
//     );

//     photo = `http://localhost:3000/photo/${req.file.filename}`;
//   }

//   const newContact = await createContact({
//     ...req.body,
//     userId: req.user._id,
//     photo,
//   });

//   res.status(201).json({
//     status: 201,
//     message: `Successfully created a contact!`,
//     data: newContact,
//   });
// };





export const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  let photo = null;

  // Перевірка, чи переданий файл
  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === "true") {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path); // Видалення локального файлу після завантаження

      photo = result.secure_url;
    } else {
      // Якщо Cloudinary не використовується, перемістити файл у локальну папку
      await fs.rename(
        req.file.path,
        path.resolve("src", "public/photo", req.file.filename)
      );

      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  // Створення контакту
  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo, // Якщо фото не передано, залишиться `null`
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
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
  const { contactId } = req.params;
  const userId = req.user._id.toString();

  const result = await updateContact(userId, contactId, req.body, {
    upsert: true,
  });
  if (!result) {
    throw httpError(404, "Student not found");
  }
  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};


export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  let photo = null;

  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public/photo', req.file.filename),
      );
      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  const updatedData = { ...req.body };
  if (photo) {
    updatedData.photo = photo;
  }

  const result = await updateContact(contactId, updatedData, req.user._id);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};

