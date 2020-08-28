const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.waitForSelector('button.gdpr-cookie-layer__btn--submit');
  await context.click('button.gdpr-cookie-layer__btn--submit');

  await context.evaluate(async function () {
    if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
      document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
    }
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation,
};
