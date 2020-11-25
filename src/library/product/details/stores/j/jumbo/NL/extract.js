const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const dataRef = await context.extract(productDetails, { transform });
    function reduceInfoToOneField (field) {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          fieldText += ' -' + element.text;
        });
        field[0].text = fieldText.replace(/\n/g, ': ');
        return field.splice(1);
      }
    }
    const ingredientsList = dataRef[0].group[0].ingredientsList;
    const description = dataRef[0].group[0].description;
    reduceInfoToOneField(description);
    reduceInfoToOneField(ingredientsList);
    dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/:"(\w+)"/)[1];
    return dataRef;
  },
};
