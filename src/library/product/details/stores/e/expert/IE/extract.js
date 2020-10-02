const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
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

    await context.evaluate(async function () {
      var elmnt = document.querySelector('div.page-wrapper, div.footer-main');
      elmnt.scrollIntoView();
    });

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(async function () {
      if (document.querySelector('iframe#loadbeeTabContent')) {
        return document.querySelector('iframe#loadbeeTabContent').getAttribute('src');
      } else if (document.querySelector('iframe#eky-dyson-iframe')) {
        return document.querySelector('iframe#eky-dyson-iframe').getAttribute('src');
      } else if (document.querySelector('div#flix-minisite > a')) {
        const url = document.querySelector('div#flix-minisite > a').getAttribute('onclick');
        const flickSplitURL = url.split('_FFOpenWin("').length ? (url.split('_FFOpenWin("')[1]) : '';
        const flickURL = flickSplitURL.split(')')[0];
        return 'https:' + flickURL;
      }
      return null;
    });

    if (apiManufCall) {
      const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'body img', 'src');
      content = obj.content;
      image = obj.image;
      sharedhelpers.addHiddenInfo('ii_manufContent', content);
      if (image.length) {
        sharedhelpers.addHiddenArrayList('ii_manufImg', image);
      }
    }

    const termAndCond = await context.evaluate(async function () {
      return document.querySelector('div.footer-online-shopping-part div.footer-slide li a[href*="term-conditions"]');
    });

    sharedhelpers.addHiddenInfo('ii_termCond', termAndCond ? 'Yes' : 'No');

    try {
      await context.waitForSelector('div.fotorama-item', { timeout: 45000});
    } catch (error) {
      console.log('No secondary images loading.');
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
