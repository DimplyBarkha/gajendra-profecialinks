const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform: transform,
    domain: 'whisky.de',
  },
  openSearchDefinition: {
    template: 'https://www.whisky.de/shop/index.php?cl=search&searchparam={searchTerms}',
  },
};

