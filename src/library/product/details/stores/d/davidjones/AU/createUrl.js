
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'davidjones.com',
    prefix: "Product",
    url: "https://www.davidjones.com/Product/{id}",
    country: 'AU',
    store: 'davidjones',
    zipcode: '',
  },
};
