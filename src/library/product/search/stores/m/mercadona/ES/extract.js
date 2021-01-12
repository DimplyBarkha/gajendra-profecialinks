const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'mercadona',
    transform,
    domain: 'mercadona.es',
    zipcode: '46008',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('.section');
    await context.evaluate(async () => {
      const productUrl = 'https://tienda.mercadona.es/product/';

      function getCorrectSearchTerms (searchTerms) {
        searchTerms = searchTerms.replace('?query=', '');
        if (searchTerms.includes('%20')) {
          searchTerms = searchTerms.replace(/%20/g, ' ');
        }
        if (searchTerms.includes('%C3%B1')) {
          searchTerms = searchTerms.replace(/%C3%B1/g, 'ñ');
        }
        if (searchTerms.includes('%C3%A1')) {
          searchTerms = searchTerms.replace(/%C3%A1/g, 'á');
        }
        if (searchTerms.includes('%C3%A9')) {
          searchTerms = searchTerms.replace(/%C3%A9/g, 'é');
        }
        if (searchTerms.includes('%C3%AD')) {
          searchTerms = searchTerms.replace(/%C3%AD/g, 'í');
        }
        if (searchTerms.includes('%C3%B3')) {
          searchTerms = searchTerms.replace(/%C3%B3/g, 'ó');
        }
        if (searchTerms.includes('%C3%BA')) {
          searchTerms = searchTerms.replace(/%C3%BA/g, 'ú');
        }
        if (searchTerms.includes('%C3%BC')) {
          searchTerms = searchTerms.replace(/%C3%BC/g, 'ü');
        }

        return searchTerms;
      }

      const url = 'https://7uzjkl1dj0-dsn.algolia.net/1/indexes/products_prod_vlc1_es/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser&x-algolia-application-id=7UZJKL1DJ0&x-algolia-api-key=9d8f2e39e90df472b4f2e559a116fe17';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: getCorrectSearchTerms(location.search) }),
      }).then(res => res.json())
        .then(items => items.hits);

      function addHiddenDiv (className, content, product) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        product.appendChild(newDiv);
      }
      const products = document.querySelectorAll('.product-cell');
      console.log(products);
      products.forEach((product, index) => {
        addHiddenDiv('helper-price', response[index].price_instructions.unit_price, product);
        addHiddenDiv('helper-rank', index + 1, product);
        addHiddenDiv('helper-id', response[index].id, product);
        addHiddenDiv('helper-productUrl', productUrl + response[index].id, product);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
