const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    while (scrollTop !== 15000) {
      await stall(1000);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 15000) {
        await stall(1000);
        break;
      }
    }
  });

  await context.evaluate(() => {
    const productUrl = document.querySelectorAll('div.col-xs-5.col-sm-5.col-md-12.img-wrap>a');
    const priceSelector = document.querySelectorAll('p.item-prize');
    const searchUrl = window.location.href;

    for (let i = 0; i < productUrl.length; i++) {
      let price = priceSelector[i].textContent;
      price = price.replace('.', ',');
      productUrl[i].setAttribute('url', productUrl[i].href);
      productUrl[i].setAttribute('rank', `${i + 1}`);
      priceSelector[i].setAttribute('price', price);
    }

    document.querySelector('body').setAttribute('searchurl', searchUrl);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasanpablo',
    transform,
    domain: 'farmaciasanpablo.com.mx',
    zipcode: "''",
  },
  implementation,
};
