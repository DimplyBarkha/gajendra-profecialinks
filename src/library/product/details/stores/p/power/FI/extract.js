const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'power',
    transform: cleanUp,
    domain: 'power.fi',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i');
    try{
      await context.waitForSelector('#product-intro pwr-product-stock-label');
    }
    catch(err){
    }
    await context.click('#product-information-tabs > div:nth-child(1) > div > i');
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await context.evaluate(async function () {
      // utility functions
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath (path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      async function scroll () {
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
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await scroll();

      // Retriving data
      const images = document.querySelectorAll('div.product-main-card div.product-image-container img');
      if (images) {
        for (let index = 0; index < images.length; index++) {
          document.querySelector('div.owl-next i.icon-expert-arrow').click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        images.forEach(e => {
          const imageSrc = e.getAttribute('src');
          addElementToDocument('images', imageSrc);
        });
      }

      const price = document.querySelector('*#product-intro div.prices-container')
        ? document.querySelector('*#product-intro div.prices-container').innerText : '';
      if (price) addElementToDocument('price', price.replace(' ', ','));

      const savings = document.querySelector('div.product-sticker-price')
        ? document.querySelector('div.product-sticker-price').innerText : '';
      if (savings) addElementToDocument('savings', savings);

      const imageAlt = document.querySelector('div.product-image-container img') ? document.querySelector('div.product-image-container img').getAttribute('alt') : '';
      if (imageAlt) addElementToDocument('imageAlt', imageAlt);

      await timeout(2000);

      const brand = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Valmistaja")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Valmistaja")]/following-sibling::div').textContent
        : '';
      if (brand) addElementToDocument('brand', brand);

      const eangtin = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"EAN")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"EAN")]/following-sibling::div').textContent
        : '';
      if (eangtin) addElementToDocument('eangtin', eangtin);

      let stock = getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[2]/span/@class')
        ? getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[2]/span/@class').textContent
        : '';

      if (stock) {
        if (stock.includes('stock-available')) {
          stock = 'In Stock';
        } else {
          stock = 'Out of Stock';
        }
        addElementToDocument('stock', stock);
      } else {
        stock = 'Out of Stock';
        addElementToDocument('stock', stock);
      }

      const color = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pääväri")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pääväri")]/following-sibling::div').textContent
        : '';
      if (color) addElementToDocument('color', color);

      const weightNet = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettopaino")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettopaino")]/following-sibling::div').textContent
        : '';
      if (weightNet) addElementToDocument('weightNet', weightNet);

      const weightGross = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttopaino")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttopaino")]/following-sibling::div').textContent
        : '';
      if (weightGross) addElementToDocument('weightGross', weightGross);

      const dimensions = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pakkauksen koko")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pakkauksen koko")]/following-sibling::div').textContent
        : '';
      if (dimensions) addElementToDocument('dimensions', dimensions);

      const mpc = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"tuotekoodi")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"tuotekoodi")]/following-sibling::div').textContent
        : '';
      if (mpc) addElementToDocument('mpc', mpc);

      const warranty = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "takuu")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "takuu")]').textContent
        : '';
      if (warranty) addElementToDocument('warranty', warranty);

      const storage = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "varastointi")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "varastointi")]').textContent
        : '';
      if (storage) addElementToDocument('storage', storage);

      const shipingInfo = getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]')
        ? getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]').textContent
        : '';
      if (shipingInfo) addElementToDocument('shipingInfo', shipingInfo);
      // need to click the specifications tab to get the data
      const specTabButton = document.evaluate('//div[contains(@class,"product-information")]//h3[contains(.,"Tekniset tiedo")]', document).iterateNext();
      if (specTabButton) {
        specTabButton.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const specifications = document.querySelectorAll('pwr-product-specifications > div');
      const specArr = [];
      if (specifications) {
        specifications.forEach(e => {
          specArr.push(e.innerText.replace(/\n/g, '').replace(/\s{2,}/g, ' '));
        });
      }
      addElementToDocument('specifications', specArr.join(' || '));

      const bulletInfo = document.querySelectorAll('div.product-intro-details ul.product-description-bullets li');
      const descBulletInfo = [''];
      if (bulletInfo) {
        bulletInfo.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('descBulletInfo', descBulletInfo.join(' || '));

      const manufacturerDesc = document.querySelector('div#product-tab-description')
        ? document.querySelector('div#product-tab-description').innerText : '';
      if (manufacturerDesc) addElementToDocument('manufacturerDesc', manufacturerDesc.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));

      const legal = document.querySelector('*#footer-site div.e-maerket-notice.marg')
        ? document.querySelector('*#footer-site div.e-maerket-notice.marg').innerText : '';
      if (legal) addElementToDocument('legal', legal);

      await timeout(5000);

      const retrieveVideoDuration = async () => {
        // @ts-ignore
        console.log('retrieving VideoDuration..');
        const iframeDoc = document.querySelector('iframe.videoly-box') && document.querySelector('iframe.videoly-box').contentWindow;
        if (iframeDoc && iframeDoc.document && iframeDoc.document.body && iframeDoc.document.body.innerHTML) {
          const parser = new DOMParser();
          console.log('VideoDuration found..');
          const htmlDoc = parser.parseFromString(iframeDoc.document.body.innerHTML, 'text/html');
          const videoDurations = htmlDoc.querySelectorAll('.video-duration ');
          videoDurations && videoDurations.forEach(item => {
            console.log(`Duration: ${item.textContent}`);
            addElementToDocument('videoDurations', item.textContent);
          });
          console.log('VideoDuration retrieved..');
        } else {
          console.log('VideoDuration not retrieved..');
        }
      };

      const retrieveVideos = async () => {
        // video urls from manufacturer description
        const videoElements = document.querySelectorAll('iframe[title*="Flix-media-video"]');
        if (videoElements && videoElements.length > 0) {
          videoElements.length ? console.log('videoElements from manufacturer description found..') : console.log('videoElements from manufacturer description not found');
          videoElements && videoElements.forEach(item => {
            const videoEle = item.getAttribute('src');
            addElementToDocument('videoUrls', videoEle);
          });
        }

        // get videos from gallery section
        const sku = document.querySelector('meta[itemprop=sku]') && document.querySelector('meta[itemprop=sku]').hasAttribute('content') ? document.querySelector('meta[itemprop=sku]').getAttribute('content') : '';
        let productTitle = document.querySelector('.product-header h1') ? document.querySelector('.product-header h1').textContent : '';
        productTitle = encodeURIComponent(productTitle);
        const brandName = document.querySelector('div.brand-logo img') && document.querySelector('div.brand-logo img').hasAttribute('alt') ? document.querySelector('div.brand-logo img').getAttribute('alt') : '';
        const apiUrl = `https://dapi.videoly.co/1/videos/0/294/?SKU=${sku}&productTitle=${productTitle}&brandName=${brandName}&_pl=fi&_cl=fi&hn=www.power.fi&sId=s%3AVhBnRFUBWdwG5FtjHmeCiQXBWhEsSfXP.m5bSP3OWjWwT2Bl0G2Q7mtqF27DOe%2BCA%2B2NQw0VBq8I`;
        let data = '';
        const prom = await fetch(apiUrl);
        try {
          data = await prom.json();
        } catch (er) {
          console.log(er.message);
        }
        if (data && data.items) {
          data.items.forEach(q => {
            if (q.videoId) {
              addElementToDocument('videoUrl', `https://www.youtube.com/watch?v=${q.videoId}`);
            }
          });
        }
      };

      await retrieveVideoDuration();
      await retrieveVideos();

      const cookies = document.querySelector('button#cookie-notification-accept');
      if (cookies) {
        cookies.click();
        await timeout(2000);
      }
      const aggRating = document.querySelector('div.product-intro-details button[itemprop="ratingValue"]')
        ? document.querySelector('div.product-intro-details button[itemprop="ratingValue"]').innerText : '';
      if (aggRating) addElementToDocument('aggRating', aggRating.replace(/\./g, ','));
    });
    await context.evaluate(() => Array.from(document.querySelectorAll('#product-information-tabs .panel-title')).filter(h => h.innerText.includes('Tekniset')).forEach(elm => elm.click()));
    await context.extract(productDetails, { transform });
  },
};
