
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: null,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const currentSelector = 'div.pdp-description-tab-readmore';
    const result = await context.evaluate((currentSelector) => {
      return Boolean(document.querySelector(currentSelector));
    }, currentSelector);

    if (result) {
      await context.click('div.pdp-description-tab-readmore');
      console.log('Clicked');
      await context.waitForNavigation();
    }
    await context.evaluate(async function () {
      var videoArr = [];
      var getScript = document.evaluate('//script[contains(text(),\'"video"\')]', document).iterateNext() && document.evaluate('//script[contains(text(),\'"video"\')]', document).iterateNext().textContent;
      var obj = JSON.parse(getScript && getScript.split('window.__PRELOADED_STATE__ =')[1] && getScript.split('window.__PRELOADED_STATE__ =')[1].split('window.__NODE_ENV__')[0]);
      var videoLinks = obj && obj.productReducer && obj.productReducer.product && obj.productReducer.product.media.find(ele => ele.type === 'video');
      if (videoLinks) {
        videoArr.push(videoLinks.url);
      }
      var descriptionVideo = document.evaluate('//section/iframe/@src', document).iterateNext() && document.evaluate('//section/iframe/@src', document).iterateNext().textContent;
      if (descriptionVideo) {
        videoArr.push(descriptionVideo);
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
    return await context.extract(productDetails, { transform });
  },
};
