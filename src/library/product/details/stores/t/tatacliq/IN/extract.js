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
    const result = await context.evaluate(() => {
      return Boolean(document.evaluate(`//div[contains(.,'more details')]/span[contains(.,'click')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    });

    if (result) {
      await context.evaluate(() => {
        // @ts-ignore
        document.evaluate(`//div[contains(.,'more details')]/span[contains(.,'click')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
      });

      await context.waitForFunction(function (xp) {
        return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, `//div[contains(.,"Manufacturer's Details")]`);
    }

    // code to extract video urls
    try {
      await context.evaluate(async function () {
        async function getVideoLinkIfExists () {
          let videoEle = document.evaluate(`//*[@title="YouTube video player"]/@src`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (videoEle) {
            return videoEle.textContent;
          }
          return false;
        }

        let videoLinks = [];
        let imageElements = document.evaluate(`//*[@id="APIM"]/../following-sibling::div[1]/div`, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = imageElements.snapshotLength - 1; i >= 0; i--) {
          // @ts-ignore
          imageElements.snapshotItem(i).click();
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          let videoLink = await getVideoLinkIfExists();
          if (videoLink && videoLinks.indexOf(videoLink) === -1) {
            videoLinks.push(videoLink);
          }
        }
        if (videoLinks.length > 0) {
          let ulEle = document.createElement('ul');
          ulEle.setAttribute('id', 'videoLinks');
          document.body.appendChild(ulEle);
          for (let i = 0; i < videoLinks.length; i++) {
            let liEle = document.createElement('li');
            let liTextNode = document.createTextNode(videoLinks[i]);
            liEle.appendChild(liTextNode);
            document.getElementById('videoLinks').appendChild(liEle);
          }
        }
      });
    } catch (err) {
      console.log('Error while extracting video' + JSON.stringify(err));
    }

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
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

    await applyScroll(context);
    
    return await context.extract(productDetails, { transform });
  }

};