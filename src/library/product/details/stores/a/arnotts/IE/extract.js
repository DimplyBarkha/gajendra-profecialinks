const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (document.querySelector('li#pdp-carousel-video img.productthumbnail')) {
        const videoData = JSON.parse(document.querySelector('li#pdp-carousel-video img.productthumbnail').getAttribute('data-lgimg'));
        if (videoData) {
          let videoUrl = videoData.videoData;
          videoUrl = videoUrl.replace('.json', '/mp4_720p');
          addHiddenDiv('videoUrl', videoUrl);
        }
      }
      if (document.querySelector('div.tab-content')) {
        if (document.querySelector('div.tab-content').getAttribute('itemprop') == 'description') {
          let desc = document.querySelector('div.tab-content').innerHTML;
          desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
          addHiddenDiv('desc', desc);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
