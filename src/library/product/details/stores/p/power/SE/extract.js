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
    } catch (error) {
      console.log('no specification found');
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
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
      //get video URLs
      let sku = document.querySelector("meta[itemprop=sku]") && document.querySelector("meta[itemprop=sku]").hasAttribute('content') ? document.querySelector("meta[itemprop=sku]").getAttribute('content') : "";
      let productTitle = document.querySelector(".product-header h1") ? document.querySelector(".product-header h1").textContent : "";
      productTitle = encodeURIComponent(productTitle);
      let brandName = document.querySelector('div.brand-logo img') && document.querySelector('div.brand-logo img').hasAttribute('alt') ? document.querySelector('div.brand-logo img').getAttribute('alt') : "";
      let apiUrl = `https://dapi.videoly.co/1/videos/0/395/?brandName=${brandName}&SKU=${sku}&productTitle=${productTitle}&_pl=sv&_cl=sv&hn=www.power.se`;
      let data = "";
      let prom = await fetch(apiUrl);
      try {
        data = await prom.json();
      } catch (er) {
        console.log(er.message);
      }
      if (data && data.items) {
        data.items.forEach(q => {
          if (q.videoId) {
            addElementToDocument('videoUrl',`https://www.youtube.com/watch?v=${q.videoId}`);
          }
        })
      }

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
