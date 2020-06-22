
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'booker.co.uk',
    prefix: null,
    store: 'booker',
    country: 'UK',
    url: 'https://www.booker.co.uk/catalog/productinformation.aspx?code={id}',
  },
};
