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

    const loadVideo = await context.evaluate(async function () {
      return !!document.querySelector('div.flix_mod_video');
    });

    // if (apiManufCall) {
    //   const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'body img', 'src');
    //   content = obj.content;
    //   image = obj.image;
    //   content = content.replace('Overview', '').replace('Features', '');
    //   sharedhelpers.addHiddenInfo('ii_manufContent', content);
    //   if (image.length) {
    //     image.pop();
    //     sharedhelpers.addHiddenArrayList('ii_manufImg', image);
    //   }
    // }
    try {
      await context.waitForSelector('div.fotorama-item', { timeout: 85000 });
    } catch (error) {
      console.log('No secondary images loading.');
    }

    if (loadVideo) {
      try {
        await context.waitForSelector('iframe[title*="Flix-media-video"]', { timeout: 75000 });        
      } catch (error) {
        console.log('No videos loading.');
      }
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
