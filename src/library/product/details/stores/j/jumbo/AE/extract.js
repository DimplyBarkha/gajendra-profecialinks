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

    await context.evaluate(async function () {
      async function infiniteScroll() {
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
      }
      await infiniteScroll();
    });

    try {
      context.waitForSelector('#flix-std-inpage', { timeout: 30000 });
      if ('#flix-std-inpage') {
        console.log('Enhanced content loaded')
        async function infiniteScroll() {
          await context.evaluate(async function () {
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
        }
        await infiniteScroll();
      }
    } catch (err) {
      console.log(err);
      console.log('waiting again');
      try {
        context.waitForXPath('//div[@id="inpage_container"]//div[contains(@class,"inpage_selector_InTheBox")]');
        async function infiniteScroll() {
          await context.evaluate(async function () {
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
        }
        await infiniteScroll();
      } catch (err) {
        console.log(err)
      }
    }

    try {

      await context.evaluate(async function () {

        const videoId = document.evaluate("//div[contains(@class,'flix-videocontainer')]//input/@value", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let video = videoId && videoId.textContent.replace(/(.*){"file":"\\\/\\\/(.+)(.mp4)"(.*)/g, 'https://$2$3');
        addElementToDocument('added_video', video);

        let specs = [];
        let specsList = document.evaluate("//table[contains(@class,'flix-std-specs-table')]//td/div/span/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < specsList.snapshotLength; index++) {
          const element = specsList.snapshotItem(index);
          let spec = element.nodeValue;
          specs.push(spec);
        }
        let specData = specs.join('||');
        addElementToDocument('specdata', specData);

        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      });
    } catch (err) {
      console.log(err)
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
    await new Promise(resolve => setTimeout(resolve, 30000))
    return await context.extract(productDetails, { transform });
  },
};
