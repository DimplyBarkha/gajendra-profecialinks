const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const checkExistance = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  await context.waitForSelector('h1[itemprop="name"]', 3000);
  const name = await checkExistance('h1[itemprop="name"]');
  if (name) {
    const sku = 'span[itemprop="productID"]';
    const id = await context.evaluate(async (sku) => {
      const id = document.querySelector(sku) ? document.querySelector(sku).innerText : null;
      return id;
    }, sku);

    await context.evaluate(async (id) => {
      try {
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
    }, id);

    const iframeSelector = '[title="Product Videos"]';
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

    try {
      await context.waitForXPath('//div[@id="ccs-ext-spec"]/ul/li', 3000);
      await context.waitForXPath('//div[@id="ccs-ext-spec"]//tr', 3000);
      await context.waitForXPath('//*[@id="ccs-in-the-box"]//ul/li', 3000);
    } catch (error) {
      console.log('selector not found' + error);
    }

    const zoomContainer = '.zoomContainer';
    const zoomFeature = await checkExistance(zoomContainer);
    if (zoomFeature) {
      await context.evaluate(() => {
        const body = document.querySelector('body');
        body.setAttribute('zoom', 'Yes');
      });
    }

    const prodVideoSelector = '.thumb-video';
    const prodVideo = await checkExistance(prodVideoSelector);
    if (prodVideo) {
      await context.evaluate(() => {
        const thumbVideo = document.querySelector('div[class*="thumb-video"]>a');
        const dataVideo = thumbVideo.getAttribute('data-video');
        const videoLink = dataVideo.match(/(https:.+)\?/g);
        const body = document.querySelector('body');
        let videos = '';
        if (videoLink) {
          videoLink.forEach(video => {
            videos = videos + (videos ? ' | ' : '') + video;
          });
        }
        body.setAttribute('prod-video', videos);
      });
    }

    const enContent = await checkExistance('#wc-power-page>div');
    if (enContent) {
      try {
        await context.waitForXPath('//ul[contains(@class,"wc-rich-features")]//li[not(contains(@class,"wc-has-no-caption"))]//img', 50000);
      } catch (e) {
        console.log('selector not found in time ' + e);
      }
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
    transform,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
