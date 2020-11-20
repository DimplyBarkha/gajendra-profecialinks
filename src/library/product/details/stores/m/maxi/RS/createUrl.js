
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'maxi.rs',
    prefix: 'search.do?q',
    url: 'https://maxi.rs/search.do?q={id}',
    country: 'RS',
    store: 'maxi',
    zipcode: '',
  },
};
