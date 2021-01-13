const { transform } = require('../../../../shared');

const implementation = async (inputs, { transform }, context, { productDetails }) => {
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  // kill cookie popup
  await context.evaluate(() => {
    if (document.querySelector('div.uc-banner-content')) {
      document.querySelector('button#uc-btn-accept-banner').click();
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
      while (scrollTop !== 80000 && document.querySelectorAll('a[class*="c3-product-grid__item"]').length < 150) {
        await stall(100);
        scrollTop += 1080;
        window.scroll(0, scrollTop);
        if (scrollTop >= 80000) {
          await stall(100);
          break;
        }
      }
    });
  };
  await applyScroll(context);

  await context.evaluate(() => {
    const addProp = (selector, iterator, propName, value) => {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    const allProducts = document.querySelectorAll('a[class*="c3-product-grid__item"]');
    for (let i = 0; i < allProducts.length; i++) {
      const productElem = allProducts[i];
      const imageStyle = productElem.querySelector('div.c3-product__media') ? productElem.querySelector('div.c3-product__media').getAttribute('style') : '';
      let imageUrl = imageStyle.match(/url\("(.+)"\)/) ? imageStyle.match(/url\("(.+)"\)/)[1] : '';
      if (imageUrl.startsWith('/img/noImage')) imageUrl = `https://www.mpreis.at${imageUrl}`;
      addProp('span.c3-product__name', i, 'thumbnail', imageUrl);
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform: transform,
    domain: 'mpreis.at',
    zipcode: '',
  },
  implementation,
};
