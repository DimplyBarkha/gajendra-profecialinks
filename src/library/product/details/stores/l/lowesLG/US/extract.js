const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowesLG',
    transform: transform,
    domain: 'lowes.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      var images = JSON.parse(document.evaluate('//script[contains(text(),\'__PRELOADED_STATE__\')]', document).iterateNext().textContent.replace(new RegExp('(.+)("additionalImages":)(.+)(,"videoSets)(.+)', 'g'), '$3'));
      images.map(ele => {
        const newlink = document.createElement('a');
        newlink.setAttribute('class', 'alternateImages');
        newlink.setAttribute('href', ele.lg);
        document.body.appendChild(newlink);
      });
      if (images.length) {
        const alternateImagesCount = images.length ? images.length : '';
        const newlink = document.createElement('a');
        newlink.setAttribute('class', 'alternateImagesCount');
        newlink.setAttribute('href', alternateImagesCount);
        document.body.appendChild(newlink);
      }
      var videoApi = JSON.parse(document.evaluate('//script[contains(text(),\'__PRELOADED_STATE__\')]', document).iterateNext().textContent.match(/videos":([^\]]+])/)[1]);
      videoApi.map(ele => {
        const newlink = document.createElement('a');
        newlink.setAttribute('class', 'videoUrls');
        newlink.setAttribute('href', `https://lda.lowes.com/is/content/Lowes/${ele}`);
        document.body.appendChild(newlink);
      });
    });
    await context.extract(productDetails);
  },
};
