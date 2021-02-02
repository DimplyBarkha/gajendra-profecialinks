const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation(inputs, parameters, context, dependencies) {
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

    function fetchPage(pageNum, code, authToken) {
      const keyword = document.querySelector('#product-search-header-textbox').getAttribute('value');
      console.log(`Fetch page ${pageNum} for ${keyword}`);
      return fetch(`https://api.shipt.com/search/v3/search/?bucket_number=5&white_label_key=shipt&segway_version=${code}`, {
        headers: {
          accept: '*/*',
          'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
          authorization: `Bearer ${authToken}`,
          'content-type': 'application/json',
          'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://shop.shipt.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"user_id":4064777,"store_id":10,"metro_id":61,"store_location_id":2100,"query":"${keyword}","facets":["on_sale","active_deals","brand_name","categories","h1categories","h2categories"],"page":${pageNum},"include_visual_facets":true,"zip":"49341","featured":true,"section_id":1}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      }).then(resp => resp.json()).catch(_ => { throw new Error('Could not fetch products.'); });
    }

    function extractProducts(product, productNum) {
      addElementToDocument(`added-product-${productNum}`, window.location.href);
      const productDiv = document.querySelector(`#added-product-${productNum}`);
      productDiv.setAttribute('product-id', product.product_id);
      productDiv.setAttribute('product-url', `https://shop.shipt.com/products/${product.product_id}`);
      productDiv.setAttribute('product-name', product.display_name);
      productDiv.setAttribute('product-price', product.price);
      productDiv.setAttribute('product-image', product.image.original_size_url);
      productCount++;
    }

    const code = document.querySelector('#rollbar').textContent.match(/code_version: "(.*)?"/) ? document.querySelector('#rollbar').textContent.match(/code_version: ".(.*)?"/)[1] : '';
    const authToken = document.cookie.match(/access_token%22:%22(.*?)%/) ? document.cookie.match(/access_token%22:%22(.*?)%/)[1] : '';

    const firstPage = await fetchPage(1, code, authToken);
    // @ts-ignore
    const totalHits = firstPage.total_hits;
    console.log(`Total results: ${totalHits}`);
    // @ts-ignore
    const hitsPerPage = firstPage.hits_per_page;
    console.log(`Results per page: ${hitsPerPage}`);
    const totalPages = Math.ceil(totalHits / hitsPerPage);
    console.log(`Total pages: ${totalPages}`);

    let productCount = 0;
    for (let i = 0; i < totalPages; i++) {
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
      };
    }
    addElementToDocument('added-search-url', window.location.href);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shipt_meijer',
    transform: transform,
    domain: 'shop.shipt.com',
    zipcode: "''",
  },
  implementation,
};
