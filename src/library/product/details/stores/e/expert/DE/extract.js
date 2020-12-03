const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    let content = null;
    let image = null;
    let manufVideo = null;
    let inBoxText = null;
    let inBoxUrls = null;
    let comparisionText = null;

    const link = await context.evaluate(function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });
    console.log('apiManufCall');
    console.log(apiManufCall);

    if (apiManufCall) {
      const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'div.wrapper img[data-src]', 'data-src', 'div.wrapper div.play-btn', 'data-video', '.in-the-box', '.compare-headline');
      content = obj.content;
      image = obj.image;
      inBoxText = obj.inBoxText;
      inBoxUrls = obj.inBoxUrls;
      comparisionText = obj.comparisionText;

      console.log('obj')

      console.log(obj)

      if (inBoxUrls.length) {
        inBoxUrls.forEach((element) => {
          sharedhelpers.addHiddenInfo('ii_inBoxUrls', element);
        });
      }
      sharedhelpers.addHiddenInfo('ii_comparisionText', comparisionText);
      console.log('inBoxText');
      console.log(inBoxText);
      sharedhelpers.addHiddenInfo('ii_inBoxText', inBoxText);
      sharedhelpers.addHiddenInfo('ii_manufContent', content);
      if (image.length) {
        sharedhelpers.addHiddenInfo('ii_manufContentImg', image.join(' || '));
      }
      manufVideo = obj.video;

      if (manufVideo) {
        console.log(manufVideo);
        sharedhelpers.addHiddenInfo('ii_manufVideo', manufVideo);
      }
    }
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');
    return await context.extract(productDetails, { transform: transformParam });
  },
};
