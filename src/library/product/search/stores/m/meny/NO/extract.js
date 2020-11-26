const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform,
    domain: 'meny.no',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    const optionalWait = async (sel) => {
      async function getProductsCount (context) {
        return context.evaluate(async function () {
          const products = document.evaluate("//ul/li[contains(@class, 'ws-product-list-vertical__item')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          return products.snapshotLength;
        });
      }

      let productsCount = 0;
      while (productsCount < 150) {
        const doesLoadMoreExists = await context.evaluate(function () {
          return Boolean(document.querySelector('div.ws-search-result-full__footer button'));
        });

        if (doesLoadMoreExists) {
          await context.evaluate(async function () {
            console.log('Clicking on load more button');
            document.querySelector('div.ws-search-result-full__footer button').click();
            await new Promise((resolve, reject) => setTimeout(resolve, 10000));
          });
          productsCount = await getProductsCount(context);
          console.log('productsCount' + productsCount);
          if (productsCount >= 150) {
            break;
          }
          // await applyScroll(context);
        } else {
          break;
        }
      }

      try {
        await context.waitForSelector(sel, { timeout: 30000 });
        console.log(`Selector => "${sel}" loaded`);
        return true;
      } catch (err) {
        console.log(`Selector => ${sel} did not load.`);
        return false;
      }
    };

    const seeAll = await optionalWait("div[id='ws-search-block-products']>button[class*='ws-link']");

    if (seeAll) {
      await context.click("div[id='ws-search-block-products']>button[class*='ws-link']");
      await context.waitForNavigation({ timeout: 30000, waitUntil: 'networkidle0' });
    }

    const response = await context.searchAllRequests('/episearch/1300/products.*');
    console.log(JSON.stringify(response));

    for (const res of response) {
      if (!res.responseBody || !res.responseBody.body)continue;
      const searchResponse = JSON.parse(res.responseBody.body);

      if (!searchResponse.hits || !searchResponse.hits.hits) continue;

      for (const hit of searchResponse.hits.hits) {
        await context.evaluate(function (param) {
          const imgId = param.contentId;
          const url = param.contentData && param.contentData._source && param.contentData._source.slugifiedUrl;

          if (!imgId || !url) return;

          const img = document.querySelector(`img[src*="${param.contentId}"]`);
          if (!img) return;
          console.log(`Setting URL for ${param.contentId}`);
          img.setAttribute('url', `https://meny.no/varer${url}`);
        }, hit);
      }
    }

    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
