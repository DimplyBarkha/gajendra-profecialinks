const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const targetSelector = 'h1[itemprop="name"]';
  const name = await context.evaluate((selector) => {
    return Boolean(document.querySelector(selector));
  }, targetSelector);

  if (name) {
    await context.evaluate(async (inputs) => {
      try {
        const id = inputs.id;
        const API = `https://api.bazaarvoice.com/data/batch.json?passkey=casUKJbj2JhoSjjK5eHePNQeioLk0kTsox3ZkK2H1tajU&apiversion=5.5&displaycode=3532-en_ca&resource.q1=statistics&filter.q1=productid:eq:${id}&filter.q1=contentlocale:eq:en_CA,en_US,en_GB&stats.q1=reviews&filter_reviews.q1=contentlocale:eq:en_CA,en_US,en_GB&filter_reviewcomments.q1=contentlocale:eq:en_CA,en_US,en_GB&limit.q1=1`;
        const response = await fetch(API);
        const data = await response.json();
        const rating =
          data.BatchedResults.q1.Results[0].ProductStatistics.ReviewStatistics
            .AverageOverallRating || 0;
        const ratingCount =
          data.BatchedResults.q1.Results[0].ProductStatistics.ReviewStatistics
            .TotalReviewCount;
        document.body.setAttribute(
          'rating',
          (Math.round(rating * 10) / 10).toString(),
        );
        document.body.setAttribute('rating-count', ratingCount);
      } catch (err) {
        console.log(err);
      }
    }, inputs);

    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };

    let iframeSelector = '[title="Product Videos"]';
    const result = await checkExistance(iframeSelector);
    if (result) {
      await context.evaluate(async (iframeSelector) => {
        const mainBody = document.querySelector('body');
        const iframe = await document.querySelector(iframeSelector);
        const iframeDoc = iframe.contentDocument;
        const video = await iframeDoc.querySelector('video');
        const videoSrc = video.getAttribute('src');
        mainBody.setAttribute('video-src', videoSrc);
      }, iframeSelector);
    }

    iframeSelector = '[title="Product Views"]';
    const result1 = await checkExistance(iframeSelector);
    if (result1) {
      await context.evaluate(async (iframeSelector) => {
        const mainBody = document.querySelector('body');
        mainBody.setAttribute('three-sixty', 'Yes');
      }, iframeSelector);
    }

    const zoomContainer = '.zoomContainer';
    const zoomFeature = await checkExistance(zoomContainer);
    if (zoomFeature) {
      await context.evaluate(() => {
        const body = document.querySelector('body');
        body.setAttribute('zoom', 'Yes');
      });
    }

    return await context.extract(productDetails, { transform });
  } else {
    throw new Error('Product name not found.');
  }
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    transform: cleanUp,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
