
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'cvs.com',
    prefix: null,
    country: 'US',
    store: 'cvs',
    url: 'https://www.cvs.com/shop-assets/proxy/search?query={id}&skip=0&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D',
  },
};
