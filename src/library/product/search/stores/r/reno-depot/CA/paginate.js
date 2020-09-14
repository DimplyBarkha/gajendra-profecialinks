
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'reno-depot',
    loadedSelector: 'div[@class="module_productlist"]',
    domain: 'renodepot.com',
  },
};
