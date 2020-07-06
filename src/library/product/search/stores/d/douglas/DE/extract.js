const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('div.rd__rating__result').forEach(rating => {
      const width = Number(rating.getAttribute('style').match(/\d+/)[0]);
      rating.parentElement.parentElement.innerText = (width / 20).toString();
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform,
    domain: 'douglas.de',
  },
  implementation,
};
