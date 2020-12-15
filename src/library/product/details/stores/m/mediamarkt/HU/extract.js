const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    // @ts-ignore
    let featButton = document.querySelector('div.features-wrapper a');
    if (featButton) {
      featButton.click();
    }
    let featValues = document.querySelectorAll('#features dd + dd');
    if (featValues) {
      featValues.forEach(element => {
        element.remove();
      });
    }
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
  implementation
};
