
async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords, query } = inputs;

  console.log(url);
  const destinationUrl = url
    .replace('{searchTerms}', encodeURIComponent(keywords))
    .replace('{queryParams}', query);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  async function getData (productUrl, offset) {
    productUrl = productUrl.replace('{offset}', offset);
    console.log('URL passed - ' + productUrl);
    const data = await context.evaluate(async function (reqUrl) {
      const response = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    }, productUrl, offset);
    return data;
  };

  // Get products using API
  let extractedProducts = [];

  let searchURL = `https://www.samsclub.com/api/node/vivaldi/v1/products/search/?sourceType=1&sortKey=relevance&sortOrder=1&offset={offset}&limit=48&searchTerm={searchTerms}&clubId=4774&br=true`;

  searchURL = searchURL.replace('{searchTerms}', encodeURIComponent(keywords));

  const pageOneData = await getData(searchURL, 0);
  extractedProducts = extractedProducts.concat(pageOneData.payload.records);
  if (extractedProducts.length === 0) {
    return false;
  }

  let offset = 48;
  const totalRecords = pageOneData.payload.totalRecords;

  while (offset < totalRecords && offset < 192) {
    let nextPageData = await getData(searchURL, offset);
    extractedProducts = extractedProducts.concat(nextPageData.payload.records);
    offset += 48;
  }

  await context.evaluate(function (products) {
    for (let i = 0; i < products.length; i++) {
      const div = document.createElement('div');
      console.log('i'+ i);
      div.id = products[i].onlineInventory? products[i].onlineInventory.itemNumber : (products[i].clubInventory? products[i].clubInventory.itemNumber : products[i].productId) ;
      div.className = 'products-extract';

      const name = document.createElement('span');
      name.setAttribute('name', products[i].productName);
      div.appendChild(name);

      const productUrl = document.createElement('span');
      productUrl.setAttribute('name', `http://www.samsclub.com${products[i].seoUrl}`);
      div.appendChild(productUrl);

      const productImage = document.createElement('span');
      productImage.setAttribute('name', `https:${products[i].listImage}`);
      div.appendChild(productImage);

      const productReviewRating = document.createElement('span');
      productReviewRating.setAttribute('name', products[i].reviewRating);
      div.appendChild(productReviewRating);

      const productReviews = document.createElement('span');
      productReviews.setAttribute('name', products[i].reviewCount);
      div.appendChild(productReviews);

      const productPricing = document.createElement('span');
      productPricing.setAttribute('name', products[i].onlinePricing ? products[i].onlinePricing.finalPrice.currencyAmount: (products[i].clubPricing ? products[i].clubPricing.finalPrice.currencyAmount : ''));
      div.appendChild(productPricing);

      document.body.appendChild(div);
    }
  }, extractedProducts);

  return true;
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    url: 'https://samsclub.com/s/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
  },
  implementation
};
