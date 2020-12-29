
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (context) {
    const checkBlankPage = document.querySelector('td[class="code depth_1"]');
    if (checkBlankPage === null) {
      throw new Error('Blank Page');
    }
  });
  return await context.extract(productDetails, { transform });
}
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation,
};
