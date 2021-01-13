async function implementation (
  inputs,
  { url },
  context,
  dependencies,
) {
  const { query } = inputs;
  console.log(url);

  // uk url: https://www.shopstyle.co.uk/browse/womens-clothes
  const ukRun = url.includes('co.uk');

  const domainSuffix = ukRun ? '.co.uk' : '.com';
  await context.goto(`https://www.shopstyle${domainSuffix}/browse/womens-clothes`, { timeout: 20000, waitUntil: 'load' });

  const apiUrl = url.indexOf('{queryParams}') > -1 ? url.replace('{queryParams}', query) : url;

  await context.evaluate(async (apiUrl, ukRun) => {
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

      if (ukRun) {
        addDiv('FilterType', data.products[0].retailer.name + ' ' + data.metadata.category.id);
      } else {
        addDiv('FilterType', data.htmlProperties.metaDescription);
      }
      addDiv('apiUrl', apiUrl);

      data.products.forEach((product, rankIndex) => {
        const allSizes = product.sizes.map(size => size.name);
        product.rank = rankIndex + 1;
        for (let i = 0; i < allSizes.length; i++) {
          product.mySize = allSizes[i];
          addDiv('product', JSON.stringify(product));
        }
      });
    }
  }, apiUrl, ukRun);

  return true;
}

module.exports = {
  implementation,
};
