const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 5000));
  const isPopupPresent = await context.evaluate(async () => {
    return document.querySelector('p[id*="dialog"] + button');
  });
  if (isPopupPresent) {
    await context.click('p[id*="dialog"] + button');
  }
  await context.evaluate(async () => {
    // scroll
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
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
    const prodContainer = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]');
    prodContainer.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });

    const rawNumber = document.querySelector('span[class*="db585-less"] span span').textContent;
    const match = parseInt(rawNumber);

    let scrollTop = 0;
    const scrollLimit = match * 40;
    while (scrollTop <= scrollLimit) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

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
