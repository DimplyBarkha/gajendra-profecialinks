const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: transform,
    domain: 'nykaa.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const searchTerm = await context.evaluate(async () => {
      return window.location.href.match(/q=(.+)/)[1];
    });
    // function for fetching & preparing data to append it to extraction result
    async function getProducts (searchTerm, offset) {
      const productsArray = [];
      let fetchedProductsArray = [];
      const numberOfResults = await context.evaluate(async function () {
        const quantity = Number(document.querySelector('div.page-title-search-result').textContent.match(/of\s(\d+)/)[1]);
        return quantity > 150 ? 150 : quantity;
      });
      const SearchUrl = await context.evaluate(async () => {
        return window.location.href;
      });
      async function fetchData (searchTerm, offset) {
        let products = await context.evaluate(async function (searchTerm, offset) {
          const response = await fetch(`https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from=${offset}&search=${searchTerm}&source=react#[!opt!]{"type":"json"}[/!opt!]`);
          const responseObj = await response.json();
          return responseObj.response.products;
        }, searchTerm, offset);
        products = products.filter(product => {
          if (product.object_type !== 'tiptile') {
            return product;
          }
        });
        return products;
      }
      while (offset < 150) {
        fetchedProductsArray = [...fetchedProductsArray, ...await fetchData(searchTerm, offset)];
        if (fetchedProductsArray.length === numberOfResults) {
          break;
        }
        offset += 20;
      }
      fetchedProductsArray.forEach((product, index) => {
        const rowObject = {};
        if (product.parent_id) {
          rowObject.id = [{ text: product.parent_id }];
        }
        rowObject.searchUrl = [{ text: SearchUrl }];
        if (product.name) {
          rowObject.name = [{ text: product.name }];
        }
        if (product.product_url) {
          rowObject.productUrl = [{ text: product.product_url }];
        }
        if (product.image_url) {
          rowObject.thumbnail = [{ text: product.image_url }];
        }
        if (product.rating) {
          rowObject.aggregateRating2 = [{ text: product.rating }];
        }
        if (product.rating_count) {
          rowObject.ratingCount = [{ text: product.rating_count }];
          rowObject.reviewCount = [{ text: product.rating_count }];
        }
        if (product.final_price) {
          rowObject.price = [{ text: `₹${product.final_price}` }];
        }
        rowObject.rank = [{ text: index + 1 }];
        rowObject.rankOrganic = [{ text: index + 1 }];
        productsArray.push(rowObject);
      });
      return productsArray;
    };
    const products = await getProducts(searchTerm, 0);
    const dataRef = await context.extract(productDetails, { transform });
    dataRef[0].group = products;
    return dataRef;
  },
};
