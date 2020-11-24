const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    transform,
    domain: 'lowes.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div#footerApp');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div#footerApp');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('div#wc-aplus');
    } catch (error) {
      console.log('Manufacturer content not loaded');
    }
    await context.evaluate(async function () {
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
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },

};
