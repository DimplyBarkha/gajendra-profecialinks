const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const videos = await context.evaluate(function () {
      const videoClicks = document.querySelectorAll('div[data-comp*="Carousel"] img[src*="VideoImagesNEW"]');
      const videos = [];
      for (let i = 0; i < videoClicks.length; i++) {
        const link = videoClicks[i].getAttribute('src');
        if (!videos.includes(link)) { videos.push(link); }
      }
      return videos;
    });
    if (videos && videos.length) {
      for (let i = 0; i < videos.length; i++) {        
        await context.click(`img[src='${videos[i]}']`);
        const request = await context.searchForRequest('https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/6173784723001');
        const data = request && request.responseBody && request.responseBody.body ? JSON.parse(request.responseBody.body) : '';
        console.log('Video response found', data);
        console.log(`Request: ${request}`);
      }
    }
    return await context.extract(productDetails, { transform: transformParam });
  },
};
