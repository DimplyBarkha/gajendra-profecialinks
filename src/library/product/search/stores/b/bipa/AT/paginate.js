
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    domain: 'bipa.at',
    nextLinkSelector: 'button#more-products-button',
    zipcode: '',
  },
};
