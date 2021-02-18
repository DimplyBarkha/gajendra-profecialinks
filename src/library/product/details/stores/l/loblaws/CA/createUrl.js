
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'loblaws.ca',
    prefix: null,
    // url: "https://www.loblaws.ca/p/{id}_EA",
    url: 'https://www.loblaws.ca/search?search-bar={id}',
    country: 'CA',
    store: 'loblaws',
    zipcode: '',
  },
};

