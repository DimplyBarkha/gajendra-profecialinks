const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa_mweb',
    transform: cleanUp,
    domain: 'nykaa.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      async function extractHeaders (header) {
        if (document.querySelector(`ul.description-table__tabs-lists.tabs-list > li#${header}`)) {
          // @ts-ignore
          await document.querySelector(`ul.description-table__tabs-lists.tabs-list > li#${header}`).click();
          return document.querySelector('div.pdp-description-tab-item.description-expand')
            ? document.querySelector('div.pdp-description-tab-item.description-expand').textContent : '';
        }
      }
      // @ts-ignore
      if (document.querySelector('div.pdp-description-tab-readmore')) await document.querySelector('div.pdp-description-tab-readmore').click();
      const data = {};
      const preloadedState = document.evaluate('//script[contains(text(), "window.__PRELOADED_STATE__")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (preloadedState) data.sku = preloadedState.match(/"sku":"(.*?)"/) ? preloadedState.match(/"sku":"(.*?)"/)[1] : '';

      data.url = window.location.href.replace('nykaaman', 'nykaa');
      // @ts-ignore
      const alternateImages = [...document.querySelectorAll('div.product_description div.slick-track img')].map(el => el.src.replace(/-50,/g, '-344,')).slice(1);
      data.alternateImagesCount = alternateImages.length;
      data.alternateImages = alternateImages.join('|');
      const isAvailable = document.querySelector('div.product_description button.combo-add-to-btn')
        ? document.querySelector('div.product_description button.combo-add-to-btn').textContent.includes('ADD TO BAG') : false;
      data.availability = isAvailable ? 'In Stock' : 'Out Of Stock';
      data.quantity = document.querySelector('h1.product-title > span')
        ? document.querySelector('h1.product-title > span').textContent.replace(/\(|\)/g, '') : '';
      data.upc = window.location.href.match(/skuId=(\d+)/) ? window.location.href.match(/skuId=(\d+)/)[1] : window.location.href.match(/\/p\/(\d+)/)[1];
      data.rating = document.querySelector('section.product-rating-summary > div.rs-text > strong')
        ? document.querySelector('section.product-rating-summary > div.rs-text > strong').textContent : '';
      const brandLink = document.evaluate('(//div[contains(@class,"pdp-description-tab")]//a[contains(@href,"brands")]/@href)[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (brandLink) data.brandLink = `https://www.nykaa.com${brandLink}`;
      data.howToUse = await extractHeaders('howToUse');
      data.ingredients = await extractHeaders('ingredients');
      // Click on description to make it active - extracted in extract.yaml
      await extractHeaders('description');
      const variantInfo = document.evaluate('//div[contains(@class,"selected")]//img/@alt|//label[contains(@class,"selected")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      data.variantInfo = variantInfo.match(/ - (.*)/) ? variantInfo.match(/ - (.*)/)[1] : variantInfo;
      data.additionalDesc = '';
      document.querySelectorAll('div.pdp-description-tab-item.description-expand > div > div,div.pdp-description-tab-item.description-expand p:not([class*=mrp])')
        .forEach(el => {
          data.additionalDesc += el.textContent.trim();
        });
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
