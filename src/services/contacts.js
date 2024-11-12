import Contact from "../models/contact.js";

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortOrder = 1,
  sortBy = "_id",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ userId });

  if (filter.type != null) {
    contactsQuery.where("contactType").equals(filter.type);
  }
  if (filter.isFavourite != null) {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsQuery.clone().countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const definePaginationData = (count, page, perPage) => {
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      page,
      perPage,
      totalItems: count,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  };

  const paginationData = definePaginationData(contactsCount, page, perPage);
  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId ) => {
  return await Contact.findOne({ _id: contactId, userId,  });
};
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};
export const deleteContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndDelete( {
    _id: contactId,
    userId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    {
      _id: contactId, userId },

    payload,
    { new: true, includeResultMetadata: true, ...options }
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
