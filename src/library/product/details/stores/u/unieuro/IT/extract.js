const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    try {
      if (document.querySelector('section[class*="hits"] section:first-child')) {
        document.querySelector('section[class*="hits"] section:first-child div[class*="title product-tile__title"] >a').click();
      }
    } catch (err) {
      console.log(err);
    }
  });

  await context.waitForSelector('.container', { timeout: 60000 });

  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(8000);
        break;
      }
    }

    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const vidArr = document.querySelectorAll('iframe[class*="youtube-container"]');
    let str;
    vidArr.forEach(ele => {
      if (!str) {
        str = ele.getAttribute('src');
      } else {
        str += ' | ' + ele.getAttribute('src');
      }
    });
    if (str) {
      document.body.setAttribute('video', str);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    transform: transform,
    domain: 'unieuro.it',
    zipcode: '',
  },
  implementation,
};
