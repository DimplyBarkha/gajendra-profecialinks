const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'pilulka',
    transform: transform,
    domain: 'pilulka.cz',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    var extractedData = await context.extract(productDetails, { transform });

    const reduceInfoToOneField = (fieldPath) => {
      if (fieldPath && fieldPath.length > 1) {
        let completeInfo = '';
        fieldPath.forEach(info => {
          completeInfo += info.text;
        });
        fieldPath[0].text = completeInfo;
        fieldPath.splice(1);
      }
    };

    var warnings = extractedData[0].group[0].warnings;
    reduceInfoToOneField(warnings);
    var ingredients = extractedData[0].group[0].ingredientsList;
    reduceInfoToOneField(ingredients);
    var storageInfo = extractedData[0].group[0].storage;
    reduceInfoToOneField(storageInfo);
  },
};
