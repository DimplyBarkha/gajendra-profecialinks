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

    var servingSize = extractedData[0].group[0].servingSize;
    if (servingSize) {
      servingSize[0].text = servingSize[0].text.replace(/[()]/g, '');
    }
    var servingSizeUom = extractedData[0].group[0].servingSizeUom;
    if (servingSizeUom) {
      servingSizeUom[0].text = servingSizeUom[0].text.replace(/[()\d ]/g, '').replace('per', '');
    }
    var pricePerUnitUom = extractedData[0].group[0].pricePerUnitUom;
    if (pricePerUnitUom) {
      pricePerUnitUom[0].text = pricePerUnitUom[0].text.match(/pro (.+) =/)[1];
    }
  },
};
