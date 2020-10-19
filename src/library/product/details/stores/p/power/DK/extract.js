const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'power',
    transform: cleanUp,
    domain: 'power.dk',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i');
    await context.waitForSelector('#product-intro pwr-product-stock-label');
    // await context.click('#product-information-tabs > div:nth-child(1) > div > i');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      document.querySelector('#product-information-tabs > div:nth-child(1) > div > i').click();
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
      if (price) addElementToDocument('price', price);

      const imageAlt = document.querySelector('div.product-image-container img') ? document.querySelector('div.product-image-container img').getAttribute('alt') : '';
      if (imageAlt) addElementToDocument('imageAlt', imageAlt);

      const brand = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Producent")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Producent")]/following-sibling::div').textContent
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

      const color = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"farve")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"farve")]/following-sibling::div').textContent
        : '';
      if (color) addElementToDocument('color', color);

      const weightNet = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettovægt")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettovægt")]/following-sibling::div').textContent
        : '';
      if (weightNet) addElementToDocument('weightNet', weightNet);

      const weightGross = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttovægt")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttovægt")]/following-sibling::div').textContent
        : '';
      if (weightGross) addElementToDocument('weightGross', weightGross);

      const dimensions = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttomål")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttomål")]/following-sibling::div').textContent
        : '';
      if (dimensions) addElementToDocument('dimensions', dimensions);

      const mpc = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"varekode")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"varekode")]/following-sibling::div').textContent
        : '';
      if (mpc) addElementToDocument('mpc', mpc);

      const warranty = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "garanti")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "garanti")]').textContent
        : '';
      if (warranty) addElementToDocument('warranty', warranty);

      const storage = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "opbevarings")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "opbevarings")]').textContent
        : '';
      if (storage) addElementToDocument('storage', storage);

      const shipingInfo = getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]')
        ? getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]').textContent
        : '';
      if (shipingInfo) addElementToDocument('shipingInfo', shipingInfo);
      const description = document.querySelectorAll('div#product-tab-description p');
      const descArr = [];
      if (description) {
        description.forEach(e => {
          descArr.push(e.innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
        });
      }
      addElementToDocument('description', descArr.join(' || '));
      const specifications = document.querySelectorAll('pwr-product-specifications > div');
      const specArr = [];
      if (specifications) {
        specifications.forEach(e => {
          specArr.push(e.innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
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

      const legal = document.querySelector('*#footer-site div.e-maerket-notice.marg')
        ? document.querySelector('*#footer-site div.e-maerket-notice.marg').innerText : '';
      if (legal) addElementToDocument('legal', legal);

      const iframe = document.querySelector('iframe.videoly-box');
      if (iframe) {
        const videos = iframe.contentDocument ? iframe.contentDocument.querySelectorAll('li.b-video-item div.b-video-item-tile') : [];
        videos.forEach(el =>
          addElementToDocument('urlsForVideos', `https://www.youtube.com/watch?v=${el.getAttribute('data-videoid')}`));
      };
      const videoWrapper = getElementByXpath('//div[@class="video-wrapper"]//iframe/@src')
        ? getElementByXpath('//div[@class="video-wrapper"]//iframe/@src').textContent
        : '';
      addElementToDocument('urlsForVideos', videoWrapper);
      const cookies = document.querySelector('button#cookie-notification-accept');
      if (cookies) {
        cookies.click();
        await timeout(2000);
      }
      const aggRating = document.querySelector('div.product-intro-details button[itemprop="ratingValue"]')
        ? document.querySelector('div.product-intro-details button[itemprop="ratingValue"]').innerText : '';
      if (aggRating) addElementToDocument('aggRating', aggRating.replace(/\./g, ','));
    });

    await context.extract(productDetails, { transform });
  },
};
