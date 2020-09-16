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

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i');
    await context.waitForSelector('#product-intro pwr-product-stock-label');
    await context.click('#product-information-tabs > div:nth-child(1) > div > i');
    await context.evaluate(async function () {
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

      const price = document.querySelector('*#product-intro div.prices-container')
        ? document.querySelector('*#product-intro div.prices-container').innerText : '';
      if (price) addElementToDocument('price', price.replace(' ', ','));

      const savings = document.querySelector('div.product-sticker-price')
        ? document.querySelector('div.product-sticker-price').innerText : '';
      if (savings) addElementToDocument('savings', savings);

      const imageAlt = document.querySelector('div.product-image-container img') ? document.querySelector('div.product-image-container img').getAttribute('alt') : '';
      if (imageAlt) addElementToDocument('imageAlt', imageAlt);

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

      const specifications = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pakkauksen koko")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Pakkauksen koko")]/following-sibling::div').textContent
        : '';
      if (specifications) addElementToDocument('specifications', specifications);

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

      const bulletInfo = document.querySelectorAll('div.product-intro-details ul.product-description-bullets li');
      const descBulletInfo = [];
      if (bulletInfo) {
        bulletInfo.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('descBulletInfo', descBulletInfo.join('||'));

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
    });

    await context.extract(productDetails);
  },
};
