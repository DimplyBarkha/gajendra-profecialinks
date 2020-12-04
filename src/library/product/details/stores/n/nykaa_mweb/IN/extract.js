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

      const data = {};
      data.url = window.location.href;
      // @ts-ignore
      data.alternateImages = [...document.querySelectorAll('div.product_description div.slick-track img')].map(el => el.src.replace(/-50,/g, '-344,')).slice(1);
      data.alternateImagesCount = data.alternateImages.length;
      const isAvailable = document.querySelector('div.product_description button.combo-add-to-btn')
        ? document.querySelector('div.product_description button.combo-add-to-btn').textContent.includes('ADD TO BAG') : false;
      data.availability = isAvailable ? 'In Stock' : '';
      data.quantity = document.querySelector('h1.product-title > span')
        ? document.querySelector('h1.product-title > span').textContent.replace(/\(|\)/g, '') : '';
      const sku = document.evaluate('//a[@class="all-review-btn"]/@href', document, null, XPathResult.STRING_TYPE, null).stringValue;
      data.sku = sku.match(/skuId=(\d+)/) ? sku.match(/skuId=(\d+)/)[1] : '';
      data.rating = document.querySelector('section.product-rating-summary > div.rs-text > strong')
        ? document.querySelector('section.product-rating-summary > div.rs-text > strong').textContent.replace('.', ',') : '';
      const brandLink = document.evaluate('(//div[contains(@class,"pdp-description-tab")]//a[contains(@href,"brands")]/@href)[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (brandLink) data.brandLink = `https://www.nykaa.com${brandLink}`;
      data.howToUse = await extractHeaders('howToUse');
      data.ingredients = await extractHeaders('ingredients');
      // Click on description to make it active - extracted in extract.yaml
      await extractHeaders('description');
      const variantInfo = document.evaluate('(//div[contains(@class,"product-des__options")]/div/@class)[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      data.variantInfo = variantInfo.match(/product-des__options-(.+)/) ? variantInfo.match(/product-des__options-(.+)/)[1] : '';
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
