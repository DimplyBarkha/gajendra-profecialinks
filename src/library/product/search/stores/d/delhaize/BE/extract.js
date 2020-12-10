module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    transform: transform,
    domain: 'delhaize.be',
    zipcode: '',
  },
  implementation,
};
