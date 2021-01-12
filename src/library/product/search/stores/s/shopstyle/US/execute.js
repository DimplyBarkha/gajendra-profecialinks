async function implementation (
  inputs,
  { url },
  context,
  dependencies,
) {
  const { query } = inputs;
  console.log(url);

  await context.goto('https://www.shopstyle.com/browse/womens-clothes', { timeout: 20000, waitUntil: 'load' });

  const apiUrl = url.indexOf('{queryParams}') > -1 ? url.replace('{queryParams}', query) : url;

  await context.evaluate(async (apiUrl) => {
    function addDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      document.body.appendChild(newDiv);
    }

    const response = await fetch(apiUrl
      , {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'sec-fetch-dest': 'script',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'cross-site',
        },
        referrer: window.location.href,
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
      },
    );

    if (response.status !== 200) {
      throw new Error(`Error when calling API, response status code: ${response.status}`);
    } else {
      console.log('Api call successful, appending data..');
      const data = await response.json();

      addDiv('FilterType', data.htmlProperties.metaDescription);
      addDiv('apiUrl', apiUrl);

      data.products.forEach(product => {
        addDiv('product', JSON.stringify(product));
      });
    }
  }, apiUrl);

  return true;
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'shopstyle',
    domain: 'shopstyle.com',
    url: 'https://www.shopstyle.com/api/v2/site/{queryParams}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
