const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'tatacliq',
    transform,
    domain: 'tatacliq.com',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const productPageURL = await context.evaluate(function () {
      return document.URL;
    });

    async function runAfterPageLoad (context) {
      const result = await context.evaluate(() => {
        return Boolean(document.evaluate('//div[contains(.,\'more details\')]/span[contains(.,\'click\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
      });

      if (result) {
        await context.evaluate(() => {
          // @ts-ignore
          document.evaluate('//div[contains(.,\'more details\')]/span[contains(.,\'click\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        });

        await context.waitForFunction(function (xp) {
          return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, '//div[contains(.,"Manufacturer\'s Details")]');
      }
    }

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };

    // code to extract video urls
    const productVideoLinks = await context.evaluate(async function () {
      async function getVideoLinkIfExists () {
        const videoEle = document.evaluate('//*[@title="YouTube video player"]/@src', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (videoEle) {
          return videoEle.textContent;
        }
        return false;
      }

      const videoLinks = [];
      try {
        const imageElements = document.evaluate('//*[@id="APIM"]/../following-sibling::div[1]/div', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = imageElements.snapshotLength - 1; i >= 0; i--) {
          // @ts-ignore
          imageElements.snapshotItem(i).click();
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          const videoLink = await getVideoLinkIfExists();
          if (videoLink && videoLinks.indexOf(videoLink) === -1) {
            videoLinks.push(videoLink);
          }
        }
      } catch (err) {
        console.log('Error while clicking on img clicks to extract video URLs' + JSON.stringify(err));
      }
      return videoLinks;
    });

    await runAfterPageLoad(context);

    await applyScroll(context);

    const currentPageURL = await context.evaluate(function () {
      return document.URL;
    });

    if (currentPageURL === 'https://www.tatacliq.com/') {
      console.log('Navigated to home page, redirecting to the product page');
      await context.goto(productPageURL, { timeout: '50000', waitUntil: 'networkidle0', checkBlocked: true });
      await runAfterPageLoad(context);
      await applyScroll(context);
    }

    if (productVideoLinks.length > 0) {
      await context.evaluate(function (videoLinks) {
        const ulEle = document.createElement('ul');
        ulEle.setAttribute('id', 'videoLinks');
        document.body.appendChild(ulEle);
        for (let i = 0; i < videoLinks.length; i++) {
          const liEle = document.createElement('li');
          const liTextNode = document.createTextNode(videoLinks[i]);
          liEle.appendChild(liTextNode);
          document.getElementById('videoLinks').appendChild(liEle);
        }
      }, productVideoLinks);
    }

    return await context.extract(productDetails, { transform });
  },
};
