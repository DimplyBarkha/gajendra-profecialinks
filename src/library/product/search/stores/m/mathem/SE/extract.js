const { transform } = require('../../../../shared');
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { waitForSelector } = context;
  await context.waitForSelector('div[class="two-col"] div button[class="btn full-width"]');
  await context.click('div[class="two-col"] div button[class="btn full-width"]');
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);

  async function getProductsCount (context) {
    return context.evaluate(async function () {
      const products = document.evaluate('//figure//img[@class="lazyload"]/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      return products.snapshotLength;
    });
  }

  let productsCount = 0;
  while (productsCount < 150) {
    const doesLoadMoreExists = await context.evaluate(function () {
      return Boolean(document.querySelector('#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i'));
    });

    if (doesLoadMoreExists) {
      await context.evaluate(async function () {
        console.log('Clicking on load more button');
        document.querySelector('#content-main > mh-search-result > mh-tabs > mh-tab.active > mh-product-list > section > mathem-fetch-more-btn > section > button > i').click();
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      });
      productsCount = await getProductsCount(context);
      console.log('productsCount' + productsCount);
      if (productsCount >= 150) {
        break;
      }
      await applyScroll(context);
    } else {
      break;
    }
  }

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    transform: transform,
    domain: 'mathem.se',
    zipcode: '',
  },
  implementation
 };
