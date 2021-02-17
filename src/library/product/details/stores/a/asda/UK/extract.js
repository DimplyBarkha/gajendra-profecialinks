const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'groceries.asda.com',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = "div.search-page-content__products-tab-content ul.co-product-list__main-cntr li.co-item a[data-auto-id='linkProductTitle']";
    const cssProductDetails = 'div.pdp-main-details';
    const { transform } = parameters;
    const { productDetails, Helpers: { Helpers } } = dependencies;
    const helper = new Helpers(context);

    await context.waitForSelector(cssProduct, { timeout: 10000 })
      .catch(() => console.log('No results displayed'));
    const productAvailable = await helper.checkSelector(cssProduct, 'CSS');
    console.log(`product available: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await helper.ifThereClickOnIt(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await helper.checkSelector(cssProductDetails, 'CSS');
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        console.log('ERROR: Failed to load product details page');
        return context.halt(true);
      }
    } else {
      console.log('Returning empty data');
      return context.halt(true);
    }

    const jsonFromCatalogue = await context.evaluate(async function (inputs) {
      const ajax = async (url, method, body) => {
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
        const rHeaders = {};
        // eslint-disable-next-line no-return-assign
        response.headers.forEach((value, name) => rHeaders[name] = value);
        const status = response.status;
        return response.json()
          .catch(async e => {
            throw new Error(`${e.message} for url: '${url}', method: '${method}' status: '${status}'\n ${e.stack} \n ${Object.entries(rHeaders)} \n ${response}`);
          });
      };

      const postData = (url = '', data = {}) => ajax(url, 'POST', JSON.stringify(data));
      // const getData = (url = '') => ajax(url, 'GET');

      const sku = document.querySelector('link[rel="canonical"]').href.match(/\d+$/)[0];
      console.log(`URL sku: ${sku}, inputs sku: ${inputs.id}`);

      const requestBody = {
        item_ids: [sku],
        consumer_contract: 'webapp_pdp',
        store_id: '4565',
        request_origin: 'gi',
      };

      const productDetails = await postData('https://groceries.asda.com/api/items/catalog', requestBody);
      return (productDetails.data.uber_item && productDetails.data.uber_item.items.length && productDetails.data.uber_item.items[0]) || {};
    }, inputs);

    await context.saveJson('productDetailsJSON', jsonFromCatalogue);

    await context.extract(productDetails, { transform });
  },
};
