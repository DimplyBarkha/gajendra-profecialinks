const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function stall(ms) {
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
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const productUrl = document.querySelectorAll('div.col-xs-5.col-sm-5.col-md-12.img-wrap>a');
    const priceSelector = document.querySelectorAll('p.item-prize');

    for (let i = 0; i < productUrl.length; i++) {
      let price = priceSelector[i].textContent;
      price = price.replace('.', ',');
      productUrl[i].setAttribute('url', productUrl[i].href);
      priceSelector[i].setAttribute('price', price);
    }

    const searchUrl = window.location.href;

    document.querySelector('body').setAttribute('url', searchUrl);

    stall(3000);
  });

  // const nextLinkSelector = await context.evaluate(() => {
  //   return document.querySelector('div.row.section-header.hidden-xs.hidden-sm a.next').click();
  // });

  // if (nextLinkSelector !== null) {
  //   await extractionHelper();

  //   await context.extract(productDetails, { transform });

  //   await context.evaluate(() => {
  //     document.querySelector('div.row.section-header.hidden-xs.hidden-sm a.next').click();
  //   });
  // } else {
  //   await extractionHelper();

  // return await context.extract(productDetails, { transform });
  // }

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
