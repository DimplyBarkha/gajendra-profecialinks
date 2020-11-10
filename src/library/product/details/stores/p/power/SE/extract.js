const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'power',
    transform,
    domain: 'power.se',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.click('button.coi-banner__accept');
    } catch (error) {
      console.log('no cookie button found');
    }
    try {
      await context.click('#product-information-tabs > div:nth-child(1) > div');
      //await context.click('#product-information-tabs > div#product-tab-description-panel > div');
    } catch (error) {
      console.log('no specification found');
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const iframeDoc = document.querySelector('iframe.videoly-box') && document.querySelector('iframe.videoly-box').contentWindow;
      if (iframeDoc && iframeDoc.document && iframeDoc.document.body && iframeDoc.document.body.innerHTML) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(iframeDoc.document.body.innerHTML, 'text/html');
        const videoElements = htmlDoc.querySelectorAll('div.b-video-cover');
        videoElements && videoElements.forEach(item => {
          let vidURL = item.getAttribute('style').replace(/(.*) url(\()(.*)(\))/g,'$3')
          addElementToDocument('videoUrls', vidURL);
        });
        const videoDurations = htmlDoc.querySelectorAll('.video-duration ');
        videoDurations && videoDurations.forEach(item => {
          addElementToDocument('videoDurations', item.textContent);
        });
      }
      let scrollSelector = document.querySelector('footer#footer-site');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer#footer-site');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }

      const xpath = '//iframe[@id="flix-iframe0"]/@src';
      const videoList = [];
      const videoSelector = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let index = 0; index < videoSelector.snapshotLength; index++) {
        const element = videoSelector.snapshotItem(index);
        let vidURL = element.nodeValue;
          videoList.push(vidURL);
        }

      videoList.forEach(element => addElementToDocument('added_videoUrls', element));

    });
    try {
      await context.waitForXPath('//div[@id="videoUrls"]');
    } catch (error) {
      console.log('no video found');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
