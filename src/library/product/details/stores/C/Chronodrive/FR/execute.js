
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'Chronodrive',
    domain: 'chronodrive.com',
    loadedSelector: '.visu-pdt',
    noResultsXPath: '//img[contains(@alt,"page 404")]',
    zipcode: '91160',
  },
};
