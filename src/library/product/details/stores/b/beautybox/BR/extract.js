const { cleanUp } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  var dataRef = await context.extract(productDetails, { transform });
  dataRef[0].group.forEach((row) => {
    const rating = row.aggregateRating;
    if (rating) {
      rating[0].text = rating[0].text.replace('.', ',');
    }
  });
  return dataRef;
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'beautybox',
    transform: cleanUp,
    domain: 'beautybox.com.br',
    zipcode: '',
  },
  implementation
};
