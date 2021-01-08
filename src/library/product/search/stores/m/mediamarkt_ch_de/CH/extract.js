const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    transform: transform,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async () => {
      const currentUrl = window.location.href;
      document.querySelector('body').setAttribute('searchurl', currentUrl);
    });

    var extractedData = await context.extract(productDetails, { transform });

    var extractedProducts = extractedData[0].group;
    extractedProducts.forEach(product => {
      const rating = product.aggregateRating2;
      if (rating && rating.length > 1) {
        rating[0].text += '.' + rating[1].text;
        rating.splice(1);
      }
    });

    return extractedData;
  },
};
