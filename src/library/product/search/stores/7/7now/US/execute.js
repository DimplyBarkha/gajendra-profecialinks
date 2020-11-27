async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);

  await context.evaluate(async function (inputs) {
    async function postData (url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          authority: 'www.7now.com',
          accept: 'application/json, text/plain, */*',
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9pZCI6ImQ1NGVkZGZiLWUyMjctNGRkNi04YzNiLTdiYjNhMGMzOGUzZSIsInNjb3BlIjpbImd1ZXN0Il0sImlhdCI6MTYwNjQ2OTk2MCwiZXhwIjoxNjA2NTU0NTYwfQ.Ocjiwvkp4DSZ0jB249i64FK2JceeLkFTfAD3TU8VELo',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36 OPR/72.0.3815.321',
          'x-api-key': 'dYjBHrEIC542NCkFeMHWf80Cw1qMhRPs24PzAIDq',
          'content-type': 'application/json',
          origin: 'https://www.7now.com',
          referer: 'https://www.7now.com/search-results',
          cookie: 'ga=GA1.2.892522357.1605871078; _gcl_au=1.1.1607120452.1605871087; _fbp=fb.1.1605871091850.859718474; _gid=GA1.2.1680358325.1606469958; mp_9a92fde9c1e57929204c3058109a9375_mixpanel=%7B%22distinct_id%22%3A%20%22175e55fe0fb131-06f052b2e3b7e8-4f524656-21320e-175e55fe0fc54f%22%2C%22%24device_id%22%3A%20%22175e55fe0fb131-06f052b2e3b7e8-4f524656-21320e-175e55fe0fc54f%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%7D; __stripe_mid=1c99e21e-f430-402f-a905-3b733024b7c574181d; __stripe_sid=5ed98605-ba64-4827-b5a3-d8fcb19d86cd15c572',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    };

    const productDetails = await postData('https://www.7now.com/api/inventory/digital/v3/store/26872/products/search', { query: 'pizza', suggest: false });

    productDetails.Items.forEach((item, index) => {
      const allData = document.createElement('div');
      allData.setAttribute('class', 'json_items');
      const productId = document.createElement('div');
      productId.setAttribute('class', 'product_id');
      productId.innerText = item.id;
      allData.appendChild(productId);
      const productName = document.createElement('div');
      productName.setAttribute('class', 'product_name');
      productName.innerText = item.name;
      allData.appendChild(productName);
      const productUrl = document.createElement('div');
      productUrl.setAttribute('class', 'product_url');
      productUrl.innerText = 'https://www.7now.com/search-results/' + item.name.replace(/ /g, '-');
      allData.appendChild(productUrl);
      const thumbnail = document.createElement('div');
      thumbnail.setAttribute('class', 'product_thumbnail');
      thumbnail.innerText = item.thumbnail;
      allData.appendChild(thumbnail);
      const price = document.createElement('div');
      price.setAttribute('class', 'product_price');
      price.innerText = '$' + item.price/100;
      allData.appendChild(price);
      document.body.appendChild(allData);
    });
  });

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: '7now',
    domain: '7now.com',
    url: 'https://www.7now.com/search-results',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
  implementation,
};
