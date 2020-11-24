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
    const ingredientsList = dataRef[0].group[0].ingredientsList;
    if (ingredientsList && ingredientsList.length > 1) {
      let ingredientsText = '';
      ingredientsList.forEach(ingredient => {
        ingredientsText += ' -' + ingredient.text;
      });
      ingredientsList[0].text = ingredientsText.replace(/\n/g, ': ');
      dataRef[0].group[0].ingredientsList = ingredientsList.splice(0, 1);
    }
    const description = dataRef[0].group[0].description;
    if (description && description.length > 1) {
      let descriptionText = '';
      description.forEach(desc => {
        descriptionText += ' -' + desc.text;
      });
      description[0].text = descriptionText.replace(/\n/g, ': ');
      dataRef[0].group[0].description = description.splice(0, 1);
    }
    return dataRef;
  },
};
