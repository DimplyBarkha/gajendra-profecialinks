async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params:: ', parameters);
  console.log('inputs:: ', inputs);
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
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9pZCI6ImMwM2M5Njc4LTY4MzItNDlkZi1hY2VhLTFkZmJlN2NhMjg1NCIsInNjb3BlIjpbImd1ZXN0Il0sImlhdCI6MTYxMTc3MTkyMywiZXhwIjoxNjExODU4MzIzfQ.3uWurcHcC43n9sJVt869AanIbMr_325R3lAnKZMw1rU',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
          'x-api-key': 'dYjBHrEIC542NCkFeMHWf80Cw1qMhRPs24PzAIDq',
          'content-type': 'application/json',
          origin: 'https://www.7now.com',
          referer: 'https://www.7now.com/search-results',
          cookie: '_ga=GA1.2.1299514167.1611771920; _gid=GA1.2.506073184.1611771920; _gcl_au=1.1.2101909062.1611771940; _fbp=fb.1.1611772047791.1707602959; __stripe_mid=d8cfda3f-7aa8-4cb5-a472-357ebc94d8b228aeba; __stripe_sid=91514019-2bdf-4330-8dc0-26edf4aa42a1e4395c; mp_d105ce5cd51de6bfd5902f950038a82c_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24device_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_9a92fde9c1e57929204c3058109a9375_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24device_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    };

    // const productDetails = await postData('https://www.7now.com/api/inventory/digital/v3/store/26872/products/search', { query: inputs.keywords, suggest: false });
    // console.log("input::: ", inputs[0].keywords);
    const productDetails = await postData('https://www.7now.com/api/catalog/search/products', { query: inputs[0].keywords, suggest: false });
    
    productDetails.Items.forEach((item, index) => {
      // console.log("productDetails.Items:: ", item, index);
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
      price.innerText = '$' + item.price_cap/100;
      allData.appendChild(price);
      document.body.appendChild(allData);
    });
  }, [inputs]);

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
    url: 'https://www.7now.com/search-results/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
  implementation,
};
