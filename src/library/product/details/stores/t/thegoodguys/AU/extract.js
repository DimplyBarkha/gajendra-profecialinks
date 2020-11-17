const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    transform,
    domain: 'thegoodguys.com.au',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const iframeLink = 'iframe[id="eky-dyson-iframe"]';

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 20000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };

    await optionalWait(iframeLink);

    const isSelectorAvailable = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        return !!document.querySelector(iframeLink);
      }, iframeLink);
    };
    const selectorAvailable = await isSelectorAvailable(iframeLink);

    const getSrc = async (iframeLink) => {
      console.log(`Is selector available: ${iframeLink}`);
      return await context.evaluate(function (iframeLink) {
        console.log(document.querySelector(iframeLink).getAttribute('src'));
        return document.querySelector(iframeLink).getAttribute('src');
      }, iframeLink);
    };

    if (selectorAvailable) {
      const getData = await getSrc(iframeLink);
      console.log('IFRAME SOURCE', getData);

      const currentPage = await context.evaluate(function () { return window.location.href; });
      const timeout = parameters.timeout ? parameters.timeout : 30000;
      await context.goto(getData, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      const enhancedContentInfo = await context.evaluate(function () {
        const textContent = document.querySelectorAll('.eky-overlay-text');
        const videoEls = document.querySelectorAll('video');
        const imageEls = document.querySelectorAll('img[id*="eky-"]');

        let text = '';
        Array.from(textContent).forEach(el => {
          text += text ? ` | ${el.textContent}` : el.textContent;
        });

        const videos = [];
        Array.from(videoEls).forEach(el => {
          videos.push(el.src);
        });

        const images = [];
        Array.from(imageEls).forEach(el => {
          images.push(el.src);
        });

        return { description: text.trim(), videos, images };
      });

      console.log('Navigating back to product page.');
      await context.goto(currentPage, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });

      await context.evaluate(function (content) {
        let videos = '';
        let images = '';
        content.videos.forEach(t => {
          videos += t ? ` | ${t}` : t;
        });
        content.images.forEach(t => {
          images += t ? ` | ${t}` : t;
        });
        console.log('Adding content to body');
        const body = document.querySelector('body');
        body.setAttribute('enhancedContent', content.description || '');
        body.setAttribute('videos', videos);
        body.setAttribute('images', images);
      }, enhancedContentInfo);
    }
    await context.evaluate(function () {
      const isFound = document.querySelector('div#inpage_container img[data-flixsrcset*="flixcar"]');
      if (isFound) {
        const images = [];
        let image = '';
        document.querySelectorAll('div#inpage_container img[data-flixsrcset*="flixcar"]').forEach(el => {
          images.push(`https:${el.getAttribute('data-flixsrcset').split(' ')[0]}`);
        });

        images.forEach(t => {
          image += t ? ` | ${t}` : t;
        });
        const body = document.querySelector('body');
        body.setAttribute('images', image);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
