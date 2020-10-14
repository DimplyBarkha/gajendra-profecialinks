const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // await context.evaluate(() => {

  // });

  return await context.extract(productDetails, { transform });
}



module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: null,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation,
};
