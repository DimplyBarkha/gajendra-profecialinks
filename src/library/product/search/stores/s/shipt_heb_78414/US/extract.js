const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shipt_heb_78414',
    transform: transform,
    domain: 'shop.shipt.com',
    zipcode: '78414',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function fetchPage (pageNum, code, authToken) {
        const keyword = document.querySelector('#product-search-header-textbox').getAttribute('value');
        console.log(`Fetch page ${pageNum} for ${keyword}`);

        return fetch(
          `https://api.shipt.com/search/v3/search/?bucket_number=29&white_label_key=shipt&segway_version=${code}`,
          {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              authorization:
                `Bearer ${authToken}`,
              'content-type': 'application/json',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-site',
            },
            referrer: 'https://shop.shipt.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body:
              `{"user_id":15735722,"store_id":1,"metro_id":2,"store_location_id":19,"query":"${keyword}","zip":"37205","facets":["on_sale","active_deals","brand_name","categories","h1categories","h2categories"],"page":${pageNum},"include_visual_facets":true,"featured":true,"section_id":1}`,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          },
        )
          .then(resp => resp.json())
          .catch(_ => {
            throw new Error('Could not fetch products.');
          });
      }

      function extractProducts (product, productNum) {
        addElementToDocument(`added-product-${productNum}`, window.location.href);
        const productDiv = document.querySelector(`#added-product-${productNum}`);
        productDiv.setAttribute('product-id', product.product_id);
        productDiv.setAttribute('product-url', `https://shop.shipt.com/products/${product.product_id}`);
        productDiv.setAttribute('product-name', product.display_name);
        productDiv.setAttribute('product-price', product.price);
        productDiv.setAttribute('product-image', product.image.original_size_url);
        productDiv.setAttribute('rank', String(productNum + 1));
        productCount++;
      }

      const code = document.querySelector('#rollbar').textContent.match(/code_version: "(.*)?"/)
        ? document.querySelector('#rollbar').textContent.match(/code_version: ".(.*)?"/)[1]
        : '';
      const authToken = document.cookie.match(/access_token%22:%22(.*?)%/)
        ? document.cookie.match(/access_token%22:%22(.*?)%/)[1]
        : '';

      const firstPage = await fetchPage(1, code, authToken);

      let productCount = 0;
      for (let i = 0; i < 7; i++) {
        if (productCount > 150) break;
        if (i === 0) {
          // @ts-ignore
          firstPage.hits.forEach(product => {
            extractProducts(product, productCount);
          });
        } else {
          const page = await fetchPage(i + 1, code, authToken);
          // @ts-ignore
          page.hits.forEach(product => {
            extractProducts(product, productCount);
          });
        }
      }
      addElementToDocument('added-search-url', window.location.href);
    });
    return await context.extract(productDetails, { transform });
  },
};
