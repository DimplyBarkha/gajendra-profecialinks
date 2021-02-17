async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { query } = inputs;
  // const apiUrl = `https://www.net-a-porter.com/legacy-api/polyjuice/search/resources/store/nap_us/productview/byCategory?attrs=true&category=%2Fclothing&cm_sp=topnav-_-clothing-_-allclothing&locale=en_US&pageNumber=${page}&pageSize=600`;

  const destinationUrl = url.indexOf('{queryParams}') > -1 ? url.replace('{queryParams}', query) : url;
  await dependencies.goto({ url: destinationUrl });

  await context.evaluate(async (query) => {
    function addDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let page = 1;
    let moreItems = true;

    while (moreItems) {
      const apiUrl = `https://www.net-a-porter.com/legacy-api/polyjuice/search/resources/store/nap_us/productview/byCategory?attrs=true&category=%2F${query.replace('?', '&')}&locale=en_US&pageNumber=${page}&pageSize=600`;
      
      const response = await fetch(apiUrl
        , {
          headers: {
            accept: '*/*', 'accept-language': 'en-US,en;q=0.9', 'sec-fetch-dest': 'script', 'sec-fetch-mode': 'no-cors', 'sec-fetch-site': 'cross-site',
          },
          referrer: 'https://www.net-a-porter.com',
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        },
        );
        if (response.status !== 200 && page === 1){
          throw new Error('No API calls were successful');
        }

      page++;

      if (response.status !== 200) {
        moreItems = false;
        console.log('End of API calls!');
      } else {
        console.log(`Api call successful and on page: ${page}, appending data..`);
        const data = await response.json();

        const overallCategory = data.selectedCategory.label;

        data.products.forEach(product => {
            product.overallCategory = overallCategory;
            addDiv('products', JSON.stringify(product));
        });
      }
    }
  }, query);

  return true;
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'net-a-porter',
    domain: 'net-a-porter.com',
    url: 'https://www.net-a-porter.com/en-us/shop/search/{queryParams}',
    loadedSelector: null,
    noResultsXPath: null,
    // loadedSelector: 'div[itemprop="item"]',
    // noResultsXPath: '//div[contains(@class,"EmptyList")]',
    zipcode: '',
  },
  implementation,
};
