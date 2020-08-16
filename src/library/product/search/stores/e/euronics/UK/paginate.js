
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    openSearchDefinition: {
      indexOffset: 0,
    },
    loadedSelector: 'div[class="yCmsContentSlot product-grid-right-result-slot"] div',
    domain: 'euronics.co.uk',
  },
};
