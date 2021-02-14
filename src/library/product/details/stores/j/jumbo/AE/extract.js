const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'jumbo',
    transform,
    domain: 'jumbo.ae',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const infiniteScroll = () => context.evaluate(async () => {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    });

    await infiniteScroll();

    await context.waitForSelector('#flix-std-inpage', { timeout: 60000 })
      .then(() => {
        console.log('Enhanced content loaded');
      })
      .catch((e) => {
        console.log(e);
        console.log('waiting again');
        return context.waitForXPath('//div[@id="inpage_container"]//div[contains(@class,"inpage_selector_InTheBox")]')
          .catch(() => console.log('Enhanced content did not load'));
      })
      .finally(() => infiniteScroll());

    try {
      await context.evaluate(async () => {
        const videoId = document.evaluate("//div[contains(@class,'flix-videocontainer')]//input/@value", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const video = videoId && videoId.textContent.replace(/(.*){"file":"\\\/\\\/(.+)(.mp4)"(.*)/g, 'https://$2$3').replace(/\\/g, '');
        addElementToDocument('added_video', video);

        const specs = [];
        const specsList = document.evaluate('//table[contains(@class,\'flix-std-specs-table\')]//td/div/span/text() | //div[@id="feature_groups"]//table//td/text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < specsList.snapshotLength; index++) {
          const element = specsList.snapshotItem(index);
          const spec = element.nodeValue;
          specs.push(spec);
        }
        const specData = specs.join('||');
        addElementToDocument('specdata', specData);

        const enhancedContent = [];
        const ecNodes = document.evaluate("//div[contains(@class,'flix-Text-block') or contains(@class,'flix-std-content')]//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < ecNodes.snapshotLength; index++) {
          const element = ecNodes.snapshotItem(index);
          const content = element.nodeValue;
          enhancedContent.push(content);
        }
        // const specData = specs.join('||');
        addElementToDocument('econtent', enhancedContent.join(' '));

        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      });
    } catch (err) {
      console.log(err);
    }

    // try {
    //   await new Promise(resolve => setTimeout(resolve, 5000))
    //   await context.click('a#reviews-tab-header')
    //   // await context.waitForSelector('div.hdca-fade-in-open')
    //   await context.click('a#reviews-tab-header')
    //   await new Promise(resolve => setTimeout(resolve, 5000))
    //   // await context.click('div.hdca-store-list-item__ctas>button.acl-button--primary')
    // } catch (e) {
    //   console.log(e)
    // }
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
