
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'loblaws.ca',
    prefix: null,
    url: "https://www.loblaws.ca/p/{id}_EA",
    country: 'CA',
    store: 'loblaws',
    zipcode: '',
  },
};
