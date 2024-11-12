function parseSortOrder(value) {
  if (typeof value !== "string") {
    return "asc";
  }

  if (["asc", "desc"].includes(value) !== true) {
    return "asc";
  }

  return value;
}

function parseSortBy(value) {
  if (typeof value !== "string") {
    return "_id";
  }

  const keys = [
    "_id",
    "name",
    "phoneNumber",
    "email",
    "isFavourite",
    "contactType",
    "createdAt",
    "updatedAt",
  ];

  if (keys.includes(value) !== true) {
    return "_id";
  }

  return value;
}

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);
  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
