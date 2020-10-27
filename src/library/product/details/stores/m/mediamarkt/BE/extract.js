const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.be',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    await context.evaluate(async function () {
      if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
        document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
      }
    });

    await sharedhelpers.autoScroll();

    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 15000 }, 'footer#page-footer');

    await context.evaluate(async function () {
      document.querySelector('footer#page-footer').scrollIntoView();
    });

    await context.waitForSelector('div.cms_html_container', { timeout: 15000 });

    let content = null;
    let image = null;

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const hasManuf = await context.evaluate(async function () {
      return !!document.querySelector('div#containerLoadbee');
    });

    if (hasManuf) {
      try {
        await context.waitForSelector('div#containerLoadbee', { timeout: 65000 });
        await context.waitForSelector('div.loadbeeTabContent', { timeout: 65000 });
        await context.waitForSelector('iframe#loadbeeIframeId', { timeout: 65000 });
      } catch (error) {
        console.log('Error loading manufacturer content');
      }
    }

    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeIframeId') ? document.querySelector('iframe#loadbeeIframeId').getAttribute('src') : null;
    });

    console.log('apiManufCall');
    console.log(apiManufCall);

    if (apiManufCall) {
      const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'body img', 'src');
      image = obj.image;
      content = obj.content;

      await sharedhelpers.addHiddenInfo('ii_manufContent', content);
      if (image) {
        await sharedhelpers.addHiddenArrayList('ii_manufImg', image);
      }
    }

    const availText = await context.evaluate(async function () {
      return document.querySelector('div.price-button span') ? (document.querySelector('div.price-button span').innerText === 'In winkelwagen' ? 'In Stock' : 'In Stock') : 'Out of Stock';
    });

    const avail = await context.evaluate(async function () {
      return document.querySelector('div.price-button span') ? (document.querySelector('div.price-button span').innerText === 'In winkelwagen' ? 'In Stock' : 'In Stock') : 'Out of Stock';
    });

    await sharedhelpers.addHiddenInfo('iio_availText', avail);

    await sharedhelpers.addHiddenInfo('ii_availText', availText);

    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');

    return await context.extract(productDetails, { transform });
  },
};
