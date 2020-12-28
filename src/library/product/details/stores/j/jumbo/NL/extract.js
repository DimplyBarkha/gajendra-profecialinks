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
    await context.evaluate(async () => {
      const bulletTextElements = document.querySelectorAll('section.jum-additional-info.row li');
      bulletTextElements.forEach(el => {
        el.setAttribute('bullet', `|| ${el.textContent}`);
      });
    });
    const dataRef = await context.extract(productDetails, { transform });
    function reduceInfoToOneField (field, separator = ' ') {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          fieldText += element.text + separator;
        });
        field[0].text = fieldText.slice(0, -separator.length);
        return field.splice(1);
      }
    }
    const ingredientsList = dataRef[0].group[0].ingredientsList;
    const description = dataRef[0].group[0].description;
    reduceInfoToOneField(description);
    reduceInfoToOneField(ingredientsList, ', ');
    if (dataRef[0].group[0].variantId) {
      dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/:"(\w+)"/)[1];
    }
    if (dataRef[0].group[0].quantity) {
      dataRef[0].group[0].quantity[0].text = dataRef[0].group[0].quantity[0].text.match(/(\d+\s?\w+)$/)[1];
    }
    return dataRef;
  },
};
