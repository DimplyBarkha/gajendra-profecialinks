const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const productError = await context.evaluate(async function () {
    return !!document.querySelector('h3.error-inline');
  });

  if (productError) {
    const linkURL = await context.evaluate(function () {
      return window.location.href;
    });
    console.log(linkURL);
    await context.evaluate(async function () {
      const dept = document.querySelector('a[href^="#Department"');
      if (dept) {
        dept.click();
      }
    });
    context.waitForNavigation();
    await context.goto(linkURL);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart',
    transform,
    domain: 'instacart.com',
    zipcode: '',
  },
  implementation,
};
