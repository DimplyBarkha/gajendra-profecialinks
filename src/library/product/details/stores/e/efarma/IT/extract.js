const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'efarma',
    transform: cleanUp,
    domain: 'efarma.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('description' in data[k].group[i]) {
          for (let j = 1; j < data[k].group[i].description.length; j++) {
            const descrText = data[k].group[i].description[j].text;
            if (descrText.includes('Modalità d’uso') | descrText.includes('Avvertenze') | descrText.includes('Ingredienti')) {
              data[k].group[i].description[j].text = '';
              data[k].group[i].description[j + 1].text = '';
            }
            data[k].group[i].description[0].text += ' ' + data[k].group[i].description[j].text;
          }
          data[k].group[i].description = data[k].group[i].description.slice(0, 1);
        }
      }
    }
    return data;
  },
};
