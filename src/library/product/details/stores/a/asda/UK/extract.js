const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'groceries.asda.com',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = "div.search-page-content__products-tab-content ul.co-product-list__main-cntr li.co-item a[data-auto-id='linkProductTitle']";
    const cssProductDetails = 'div.pdp-main-details';

    const waitPeriodInMS = 10000;

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    /**
     * @param {String} [cssSelector]
     * @param {String} [xpath]
     */
    const waitForSelectorToLoad = async (cssSelector, xpath) => {
      try {
        if (cssSelector) {
          await context.waitForSelector(cssSelector, { timeout: waitPeriodInMS });
        }

        if (xpath) {
          await context.waitForSelector(cssSelector, { timeout: waitPeriodInMS });
        }

        console.log(`Selector loaded => ${cssSelector || xpath}`);
      } catch (err) {
        console.log(`Selector => "${cssSelector || xpath}" never loaded in time. :(`);
      }
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: waitPeriodInMS });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await context.click(cssProduct);
      await context.waitForNavigation({ timeout: waitPeriodInMS, waitUntil: 'networkidle0' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }

      await waitForSelectorToLoad('.s7staticimage img');
      await waitForSelectorToLoad('.asda-tab-list ~ div');
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

      async function addElement (id, content = '') {
        const elem = document.createElement('div');
        console.log(`Adding element for => ${id}`);
        elem.id = id;
        elem.innerText = content;

        document.body.appendChild(elem);
      }

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

        const recipe = (item.item_enrichment && item.item_enrichment.enrichment_info && item.item_enrichment.enrichment_info.recipes) || false;

        const itemBrand = (item.item && item.item.brand) || false;

        if (itemBrand) {
          addElement('brandName', itemBrand);
        }

        if (packInfo) {
          addElement('packInfo', packInfo);
        }

        if (recipe) {
          addElement('recipe', recipe);
        }
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
