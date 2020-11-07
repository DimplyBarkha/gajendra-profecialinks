const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const isPopupPresent = document.querySelector('p[id*="dialog"] + button');
    // @ts-ignore
    if (isPopupPresent) isPopupPresent.click();
  });

  await context.evaluate(async function () {
    while (document.querySelector('button[class*="b05-less _"]') !== null) {
      // @ts-ignore
      document.querySelector('button[class*="b05-less _"]').click();
      await stall(2000);
    };

    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  await context.evaluate(async () => {
    // @ts-ignore
    if (window !== undefined) {
      return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });
  await context.evaluate(async () => {
    // @ts-ignore
    if (window !== undefined) {
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(async () => {
    const productUrl = document.querySelectorAll('div[class*="ab4-less"] div[data-bx="ple-wrap"] a');
    const prefix = 'https://www.boxed.com';

    productUrl.forEach((element) => {
      element.setAttribute('href', prefix.concat(element.getAttribute('href')));
    });
    const prodContainer = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]');
    prodContainer.forEach((element, index) => {
      element.setAttribute('rank', `${index + 1}`);
    });
    const sponsoredProducts = document.querySelectorAll('div[class*="cc3-less"]');
    // @ts-ignore
    if (sponsoredProducts) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.setAttribute('sponsored', 'yes');
      });
    }

    const notSponsoredProducts = document.querySelectorAll('div[class="c5d964238211fd3d6146832cb02cca27-less"]');
    notSponsoredProducts.forEach((product, index) => {
      product.setAttribute('rankorganic', `${index + 1}`);
    });
  });

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
