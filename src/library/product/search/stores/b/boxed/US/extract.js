const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 2000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('p[id*="dialog"] + button');
  });
  if (isPopupPresent) {
    await context.click('p[id*="dialog"] + button');
  }
  await context.evaluate(async () => {
    while (document.querySelector('button[class*="b05-less _"]') !== null) {
      // @ts-ignore
      document.querySelector('button[class*="b05-less _"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    }
    // add prefix to product url routes
    var productUrl = document.querySelectorAll('div[class*="ab4-less"] div[data-bx="ple-wrap"] a');
    var prefix = 'https://www.boxed.com';

    productUrl.forEach((element) => {
      element.setAttribute('href', prefix.concat(element.getAttribute('href')));
    });

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]');
    for (let i = 0; i < allProducts.length; i++) {
      addProp('div[class*="ab4-less"] li[data-bx="ple"]', i, 'rankorganic', `${i + 1}`);
    }
  });

  // await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: transform,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation,
};
