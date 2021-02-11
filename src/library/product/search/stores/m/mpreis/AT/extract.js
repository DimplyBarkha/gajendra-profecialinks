const { transform } = require('../../../../shared');

const implementation = async (inputs, { transform }, context, { productDetails }) => {
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  // kill cookie popup
  await context.evaluate(() => {
    const cookies = document.querySelector('button[id="uc-btn-accept-banner"]');
    if (cookies) {
      cookies.click();
    }
  });
  // scrol to the end of the page
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      const stall = (ms) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      };
      let scrollTop = 0;
      while (scrollTop !== 80000 && document.querySelectorAll('li[class="productData"]').length < 150) {
        await stall(100);
        scrollTop += 200;
        window.scrollTo(0, scrollTop);
        if (scrollTop >= 80000) {
          await stall(500);
          break;
        }
      }
    });
  };
  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    const products = document.querySelectorAll('li[class="productData"]');
    for (let i = 0; i < products.length; i++) {
      const price = document.evaluate('.//span[@class="productPriceUnit"]/following-sibling::strong', products[i], null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      const priceText = price ? price.textContent.replace('.', ',') : '';
      products[i].setAttribute('priceid', priceText);
    }
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform: transform,
    domain: 'shop.mpreis.at',
    zipcode: '',
  },
  implementation,
};
