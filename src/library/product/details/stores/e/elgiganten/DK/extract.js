
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    transform,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const overlay = document.getElementById('tab-specs-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
      const overlay1 = document.getElementById('tab-more-info-trigger');
      if (overlay1 !== undefined) {
        overlay1.click();
      }

      const videoData = document.querySelectorAll('iframe.videoly-box')[0].contentWindow.document.getElementsByTagName('ul')[0]

      if (videoData) {
        console.log(videoData);
        const packagingElem = document.createElement('div');
        packagingElem.id = 'videoList';
        packagingElem.innerText = videoData;

        document.body.appendChild(packagingElem);
      }

    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
