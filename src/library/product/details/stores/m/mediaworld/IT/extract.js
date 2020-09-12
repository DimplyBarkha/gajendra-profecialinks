const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform,
    domain: 'mediaworld.it',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    await context.evaluate(() => {
      const getAllData = JSON.parse(window.mwProductDetailData);
      const videoUrl = getAllData && getAllData.CatalogEntryView[0] && getAllData.CatalogEntryView[0].Attributes;
      const element = videoUrl.find(product => product.name === 'eVideoshopping');
      if (element) {
        const videoLink = element && element.Values[0] && element.Values[0].values;
        document.body.setAttribute('video', videoLink);
      }
    });
    await context.extract(productDetails, { transform });
  },
};
