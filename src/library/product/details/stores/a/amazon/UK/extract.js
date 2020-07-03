const { transform } = require('./format');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 20);
        });
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: 'SW1P 3EU',
  },
  implementation,
};
