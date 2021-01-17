const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    transform,
    domain: 'brownthomas.com',
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
        const specification = document.querySelectorAll('div[id="specifications"] p');
        const boxUrl = document.querySelectorAll('img[id*="eky-accessory-"]');

        let text = '';
        Array.from(textContent).forEach(el => {
          text += text ? ` | ${el.textContent}` : el.textContent;
        });

        let specifications = '';
        Array.from(specification).forEach((el, i) => {
          if (i % 2 === 0) {
            specifications += specification ? ` | ${el.textContent} : ` : el.textContent;
          } else {
            specifications += specification ? `${el.textContent}` : el.textContent;
          }
        });
        const weight = document.evaluate('//div[@id="specifications"]//p[contains(.,"Weight")]/following-sibling::p', document).iterateNext().innerText;
        const videos = [];
        Array.from(videoEls).forEach(el => {
          videos.push(el.src);
        });

        const images = [];
        Array.from(imageEls).forEach(el => {
          images.push(el.src);
        });

        const boxUrls = [];
        Array.from(boxUrl).forEach(el => {
          boxUrls.push(el.src);
        });
         
        return { description: text.trim(), spec: specifications.trim(), videos, images, weight, boxUrls };
      });

      console.log('Navigating back to product page.');
      await context.goto(currentPage, { timeout, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });

      await context.evaluate(function (content) {
        let video = '';
        let images = '';
        let boxUrls = '';
        content.videos.forEach(t => {
          video += t ? ` | ${t}` : t;
        });
        content.images.forEach(t => {
          images += t ? ` | ${t}` : t;
        });
        content.boxUrls.forEach(t => {
          boxUrls += t ? ` | ${t}` : t;
        });

        console.log('Adding content to body');
        const body = document.querySelector('body');
        body.setAttribute('enhancedContent', content.description || '');
        body.setAttribute('specifi', content.spec || '');
        body.setAttribute('videos', video);
        body.setAttribute('images', images);
        body.setAttribute('boxUrls', boxUrls);     
        body.setAttribute('weightNet', content.weight || '');
      }, enhancedContentInfo);
    }
    await context.evaluate(function () {
      const isFound = document.querySelector('div#inpage_container img[data-flixsrcset*="flixcar"]');
      const isVideo = document.querySelector('#pdp-carousel-video a');
      const nameExtended = document.querySelector('h1[itemprop="name"]');
      const isInboxUrls = document.querySelector('div[class*="InTheBox"] div[class*="flix-background-image"] > img[data-flixsrcset]');
      if (nameExtended) {
        const extended = nameExtended.innerText.replace(/Dyson/g, '');
        const body = document.querySelector('body');
        body.setAttribute('nameextended', extended);
      }
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

      if (isInboxUrls) {
        const inboxUrls = [];
        let inboxUrl = '';
        document.querySelectorAll('div[class*="InTheBox"] div[class*="flix-background-image"] > img[data-flixsrcset]').forEach(el => {
          inboxUrls.push(`https:${el.getAttribute('data-flixsrcset').split(' ')[0]}`);
        })

        inboxUrls.forEach(t => {
          inboxUrl += t ? ` | ${t}` : t;
        });
        const body = document.querySelector('body');
        body.setAttribute('boxUrls', inboxUrl);

      }
      
      if (isVideo) {
        const videosElms = [];
        let video = '';
        document.querySelectorAll('#pdp-carousel-video a').forEach(el => {
          videosElms.push(`${el.getAttribute('style').split("'")[1].split('?')[0]}\/mp4_720p`);
        });

        videosElms.forEach(t => {
          video += t ? ` | ${t}` : t;
        });
        const body = document.querySelector('body');
        body.setAttribute('videosele', video);
      }
    });

    // For inTheBoxText
    await context.evaluate(() => {
      const inBox = document.evaluate(
        '//p[contains(.,"In the Box")]/following-sibling::*',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      const values = [];
      for (let i = 0; i < inBox.snapshotLength; i++) {
        const item = inBox.snapshotItem(i);
        // @ts-ignore
        const strong = item.querySelector('strong');
        if (strong) {
          break;
        } else {
        // @ts-ignore
          const t = item.textContent;
          values.push(t);
        }
      }
      const text = values.join('|| ');
      document.body.setAttribute('in-the-box-text', text);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
