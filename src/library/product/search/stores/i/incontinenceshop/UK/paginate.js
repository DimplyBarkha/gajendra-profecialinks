
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    nextLinkSelector: 'li[class="item pages-item-next"]>a',
    loadedSelector: 'body',
    domain: 'incontinenceshop.com',
    zipcode: '',
  },
};
