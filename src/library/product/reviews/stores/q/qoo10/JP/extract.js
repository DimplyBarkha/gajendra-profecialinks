const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await context.evaluate(async function () {
    const element = document.evaluate("//button[contains(text(),'新着順')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      element.click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    transform,
    domain: 'qoo10.jp',
    zipcode: '',
  },
  implementation,
};
