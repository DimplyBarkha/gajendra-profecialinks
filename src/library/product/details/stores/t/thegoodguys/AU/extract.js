const { transform } = require('./shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   implementation: async (inputs,
//     parameters,
//     context,
//     dependencies,
//   ) => {
//   context.evaluate(() => {
//     const iframeLink = document.querySelector('iframe[id="eky-dyson-iframe"]');
//      if(iframeLink){
//       let getLink = iframeLink.getAttribute('src');

//      }
//   });
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   return await context.extract(productDetails, { transform });
// }
// }

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
        console.log(`Couldn't load selector => ${sel}`)
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
    }

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

        let text = '';
        Array.from(textContent).forEach(el => {
          text += text ? ` | ${el.textContent}` : el.textContent;
        });

        const videos = [];
        Array.from(videoEls).forEach(el => {
          videos.push(el.src);
        });

        return { description: text.trim(), videos };
      });

      console.log('Navigating back to product page.');
      await context.goto(currentPage, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });

      await context.evaluate(function (content) {
        let videos = '';
        content.videos.forEach(t => {
          videos += t ? ` | ${t}` : t;
        });

        console.log('Adding content to body');
        const body = document.querySelector('body');
        body.setAttribute('enhancedContent', content.description || '');
        body.setAttribute('videos', videos);
      }, enhancedContentInfo);
    }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  }
};