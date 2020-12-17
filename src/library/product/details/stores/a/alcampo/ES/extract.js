const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: cleanUp,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.evaluate(async () => {
      const body = document.querySelector('body');

      const isNutritionalInfoPresent = document.querySelector('div#producto_pestana_informacion_nutricion');
      if (isNutritionalInfoPresent) {
        body.setAttribute('servingsize', '100');
        body.setAttribute('servingunit', 'ml/g');
      }
    });

    var extractedData = await context.extract(productDetails, { transform });

    const formatMineralPerServing = (path, regex) => {
      if (path) {
        path[0].text = path[0].text.match(regex) ? path[0].text.match(regex)[2] : '';
      }
    };
    formatMineralPerServing(extractedData[0].group[0].sodiumPerServing, '([Ss]odio.+?)([0-9][0-9,.]+)');
    formatMineralPerServing(extractedData[0].group[0].calciumPerServing, '([Cc]alcio.+?)([0-9][0-9,.]+)');
    formatMineralPerServing(extractedData[0].group[0].magnesiumPerServing, '([Mm]agnesio.+?)([0-9][0-9,.]+)');
  },
};
