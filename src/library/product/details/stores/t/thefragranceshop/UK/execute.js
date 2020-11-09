
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    domain: 'thefragranceshop.co.uk',
    loadedSelector: 'div#all.clearfix',
    noResultsXPath: '//div[@class="text-center tfs-error"]',
    zipcode: '',
  },
};
