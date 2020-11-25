const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    transform: cleanUp,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    var extractedData = await context.extract(productDetails, { transform });

    var descriptions = extractedData[0].group[0].description;
    if (descriptions && descriptions.length > 1) {
      let fullDescription = '';
      descriptions.forEach(description => {
        fullDescription += description.text + ' ';
      });
      descriptions[0].text = fullDescription;
      descriptions.splice(1);
    }
  },
};
