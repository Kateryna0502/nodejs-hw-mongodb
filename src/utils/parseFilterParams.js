const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return null;
  const validTypes = ['work', 'home', 'personal'];
  return validTypes.includes(contactType) ? contactType : null;
};

const parseIsFavourite = (isFavourite) => {
  if (isFavourite === undefined || isFavourite === '') return null;
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return null;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};

// function parseNumber(value) {
//   if (typeof value !== 'string') {
//     return undefined;
//   }

//   const parsedNumber = parseInt(value);

//   if (Number.isNaN(parsedNumber) === true) {
//     return undefined;
//   }

//   return value;
// }

// export function parseFilterParams(query) {
//   const { minAge, maxAge } = query;

//   const parsedMinAge = parseNumber(minAge);
//   const parsedMaxAge = parseNumber(maxAge);

//   return {
//     minAge: parsedMinAge,
//     maxAge: parsedMaxAge,
//   };
// }
