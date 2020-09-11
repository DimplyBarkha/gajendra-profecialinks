const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform: cleanUp,
    zipcode: '',
    domain: 'mediaworld.it',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    await context.evaluate(() => {
      const getAllData = JSON.parse(window.mwProductDetailData);
      var videoUrl = getAllData.CatalogEntryView[0].Attributes;
      videoUrl.map(res => {
        if (res.name === 'eVideoshopping') {
          var videoUrl = res && res.Values[0] && res.Values[0].values;
          document.body.setAttribute('video', videoUrl);
        }
      });
    });
    await context.extract(productDetails, { transform });
  },
};
