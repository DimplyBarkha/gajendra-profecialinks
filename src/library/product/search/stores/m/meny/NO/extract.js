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
          console.log(`Setting URL for ${param.contentId}`);
          img.setAttribute('url', `https://meny.no/varer${url}`);
        }, hit);
      }
    }

    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
