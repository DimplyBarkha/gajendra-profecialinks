
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    nextLinkSelector: '.pagination__item--next a',
    loadedSelector: 'div[class="yCmsContentSlot product-grid-right-result-slot"] div',
    domain: 'euronics.co.uk',
  },
};
