const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    transform,
    domain: 'lowes.com',
  },
  implementation
};


async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 9000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    const images = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
        document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/) &&
        document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/"additionalImages":([^\]]+])/)[1]);
      const alternateImagesCount = images ? images.length : null;
      if (alternateImagesCount) {
        images.map(ele => {
          const secondaryImageLink = document.createElement('a');
          secondaryImageLink.setAttribute('class', 'alternateImages');
          secondaryImageLink.setAttribute('href', ele.baseUrl);
          document.body.appendChild(secondaryImageLink);
        });
        const secondaryImageCount = document.createElement('a');
        secondaryImageCount.setAttribute('class', 'alternateImagesCount');
        secondaryImageCount.setAttribute('href', alternateImagesCount);
        document.body.appendChild(secondaryImageCount);
      }
      const videoApi = JSON.parse(document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent &&
      document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/) &&
      document.evaluate('//script[contains(text(),"__PRELOADED_STATE__")]', document).iterateNext().textContent.match(/videos":([^\]]+])/)[1]);
      if (videoApi && videoApi.length) {
        videoApi.map(ele => {
          const newlink = document.createElement('a');
          newlink.setAttribute('class', 'videoUrls');
          newlink.setAttribute('href', `https://lda.lowes.com/is/content/Lowes/${ele}`);
          document.body.appendChild(newlink);
        });
      }
  });
  return await context.extract(productDetails, { transform });
}