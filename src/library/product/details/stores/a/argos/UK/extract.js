
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    transform: null,
    domain: 'argos.co.uk',
    zipcode: 'SE19PD',
  },
  implementation: async (inputs, parameters, context, dependencies, ) => {
    const defaultTimeOutInMS = 10000;

    await context.waitForNavigation({ timeout: defaultTimeOutInMS, waitUntil: 'networkidle0' });

    try {
      await context.evaluate(async function (zip) {
        const injectElementToBody = (id, value) => {
          const elem = document.createElement('div');

          elem.id = id;
          elem.innerText = value;

          document.body.appendChild(value);
        };

        const sku = document.querySelector('span[itemprop="sku"]').getAttribute('content');
        const url = `https://www.argos.co.uk/stores/api/orchestrator/v0/cis-locator/availability?maxDistance=50&maxResults=10&skuQty=${sku}_1&channel=web_pdp&timestamp=${new Date().getTime()}&postcode=${zip}`;
        console.log(url);
        const response = await (await fetch(url, { headers: { 'Content-Type': 'application/json' } })).json();

        const availability = (response.stores && response.stores[0] && response.stores[0].messages && response.stores[0].messages[sku] && response.stores[0].messages[sku].messageKey) || '';

        injectElementToBody('availability', availability);
      }, parameters.zipcode);
    } catch (err) {
      console.log('Entering zip code for availability details failed.', err);
    }

    await context.extract(dependencies.productDetails);
  },
};
