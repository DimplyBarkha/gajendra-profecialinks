const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const addSelectorProp = (selector, propName, value, allSelectorsNumber) => {
      if (!allSelectorsNumber) {
        allSelectorsNumber = 0;
      }
      document.querySelectorAll(selector)[allSelectorsNumber].setAttribute(propName, value);
    };

    if (document.querySelector('div.privacy_prompt.explicit_consent')) {
      document.querySelector('div.button.left').click();
    }

    const productsWindowsSelectors = document.querySelectorAll('li.vw-productCard');
    const numberOfProductsOnPage = productsWindowsSelectors.length;
    for (let i = 0; i < numberOfProductsOnPage; i++) {
      addSelectorProp('li.vw-productCard', 'rankOrganic', i + 1, i);
      const image = document.querySelectorAll('img.image.b-lazy')[i].getAttribute('data-src')
        ? document.querySelectorAll('img.image.b-lazy')[i].getAttribute('data-src') : document.querySelectorAll('img.image.b-lazy')[i].getAttribute('src');
      addSelectorProp('li.vw-productCard', 'imageLink', image, i);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    transform: null,
    domain: 'rakuten.de',
    zipcode: '',
  },
  implementation,
};
