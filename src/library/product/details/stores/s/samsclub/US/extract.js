const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform: cleanUp,
    domain: 'samsclub.com',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.evaluate(() => {
      const imgAlt = document.querySelector('button[class="sc-image-viewer-img-button"] img') ? document.querySelector('button[class="sc-image-viewer-img-button"] img').alt : null;
      document.body.setAttribute('imagealt', imgAlt);
      let url = window.location.href;
      document.body.setAttribute('producturl', url);

      let results = [];
      let query = document.evaluate(`(//div[@class="sc-manufacturing-element-content"])[1]//li | (//div[@class="sc-manufacturing-element-content"])[1]//td`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      if (query) {
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
        }
      }
      let specification = '';
      for (var i = 0; i < results.length; i++) {
        specification = specification + results[i].textContent
      }

      document.body.setAttribute('specification', specification);

    });
    const ratingSelecter = '#ratings-summary > div[itemprop=ratingValue]';
    const reviewSelector = 'div.bv_numReviews_component_container';
    const manufacturerImageSelector = 'div.wc-rf-banner-image-container';
    await context.waitForSelector(ratingSelecter, { timeout: 30000 });
    await context.waitForSelector(reviewSelector, { timeout: 30000 });
    await context.waitForSelector(manufacturerImageSelector, { timeout: 30000 });
    await context.extract(dependencies.productDetails);
  },
};
