
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'shop-apotheke.com',
    prefix: 'arzneimittel',
    country: 'DE',
    store: 'shop-apotheke',
    url: 'https://www.shop-apotheke.com/arzneimittel/{id}/',
  },
};
