const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/geo/geoExtract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform: null,
    domain: 'groceries.asda.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = "div.search-page-content__products-tab-content ul.co-product-list__main-cntr li.co-item a[data-auto-id='linkProductTitle']";
    const cssProductDetails = 'div.pdp-main-details';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: 10000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await context.click(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
      console.log('navigation complete!!');
    }

    await context.evaluate(async function () {
      async function postData (url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return response.json();
      };

      const sku = document.querySelector('link[rel="canonical"]').href.match(/\d+$/)[0];
      console.log('SKU => ', sku);

      const requestBody = {
        item_ids: [sku],
        consumer_contract: 'webapp_pdp',
        store_id: '4565',
        request_origin: 'gi',
      };

      const productDetails = await postData('https://groceries.asda.com/api/items/catalog', requestBody);

      const item = (productDetails.data.uber_item && productDetails.data.uber_item.items.length && productDetails.data.uber_item.items[0]) || false;

      if (item) {
        console.log('Item details found.');
        const packInfo = (item.item_enrichment && item.item_enrichment.enrichment_info && item.item_enrichment.enrichment_info.packaging) || false;

        const itemBrand = (item.item && item.item.brand) || false;

        if (itemBrand) {
          const brandElem = document.createElement('div');

          brandElem.id = 'brandName';
          brandElem.innerText = itemBrand;

          document.body.appendChild(brandElem);
        }

        if (packInfo) {
          const packagingElem = document.createElement('div');

          packagingElem.id = 'packInfo';
          packagingElem.innerText = packInfo;

          document.body.appendChild(packagingElem);
        }
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
