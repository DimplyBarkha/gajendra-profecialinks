const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform: cleanUp,
    domain: 'mediaworld.it',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
    await context.evaluate(async function () {
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      window.scrollTo(0, document.querySelector('div.main-content-tabs-container').scrollHeight);
      await timeout(5000);
      const videoArr = [];
      const getAllThumbnailVideos = JSON.parse(window.mwProductDetailData);
      const videoUrl = getAllThumbnailVideos && getAllThumbnailVideos.CatalogEntryView[0] && getAllThumbnailVideos.CatalogEntryView[0].Attributes;
      const element = videoUrl.find(product => product.name === 'eVideoshopping');
      if (element) {
        const videoLink = element && element.Values[0] && element.Values[0].values;
        videoArr.push(videoLink);
      }

      const getEnhanceContentVideos = [...document.querySelectorAll('div.fullJwPlayerWarp input')];
      if (getEnhanceContentVideos.length) {
        getEnhanceContentVideos.forEach(res => {
          const enhanceContentVideoLinks = res && res.getAttribute('value').replace(/(.+file":")([^"]+)(.+)/g, '$2').replace(/(.+)(\/.+)/g, 'http://content.jwplatform.com/videos$2');
          videoArr.push(enhanceContentVideoLinks);
        });
      }

      if (videoArr.length) {
        videoArr.forEach(res => {
          var newLink = document.createElement('li');
          newLink.className = 'VideoLinks';
          newLink.textContent = res;
          document.body.appendChild(newLink);
        });
      }
    });
    await context.extract(productDetails, { transform });
  },
};
