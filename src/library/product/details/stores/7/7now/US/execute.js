/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  let tmpUrl = url.replace('https://www.7now.com/search-results/', '').replace(/-/g, ' ');
  const othUrl = 'https://delivery.7-eleven.com/product-details/';
  if (url.includes(othUrl)) {
    tmpUrl = url.replace(othUrl, '').replace(/-/g, ' ');
  }
  console.log('@@@@@@@@@@@@@@@ tmpUrl ===', tmpUrl);
  await context.evaluate(async function (tmpUrl) {
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
          // cookie: '_ga=GA1.2.1299514167.1611771920; _gid=GA1.2.506073184.1611771920; _gcl_au=1.1.2101909062.1611771940; _fbp=fb.1.1611772047791.1707602959; __stripe_mid=d8cfda3f-7aa8-4cb5-a472-357ebc94d8b228aeba; __stripe_sid=d549429e-fcd4-4817-ad68-3ec44c1c46c9a99581; mp_9a92fde9c1e57929204c3058109a9375_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24device_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_d105ce5cd51de6bfd5902f950038a82c_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24device_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D; _gat_UA-176265559-1=1',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    };
  // await context.evaluate(async function (tmpUrl) {
  //   async function postData (url = '', data = {}) {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         authority: 'www.7now.com',
  //         accept: 'application/json, text/plain, */*',
  //         authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9pZCI6ImMwM2M5Njc4LTY4MzItNDlkZi1hY2VhLTFkZmJlN2NhMjg1NCIsInNjb3BlIjpbImd1ZXN0Il0sImlhdCI6MTYxMTc3MTkyMywiZXhwIjoxNjExODU4MzIzfQ.3uWurcHcC43n9sJVt869AanIbMr_325R3lAnKZMw1rU',
  //         'content-type': 'application/json',
  //         'content-length': '34',
  //         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
  //         'x-api-key': 'dYjBHrEIC542NCkFeMHWf80Cw1qMhRPs24PzAIDq',
  //         // //'sec-fetch-mode': 'cors',
  //         // //'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  //         // //'content-type': 'application/json',
  //         'Remote Address': '157.230.83.251:443',
  //         origin: 'https://www.7now.com',
  //         referer: 'https://www.7now.com/search-results',
  //         cookie: '_ga=GA1.2.1299514167.1611771920; _gid=GA1.2.506073184.1611771920; _gcl_au=1.1.2101909062.1611771940; _fbp=fb.1.1611772047791.1707602959; __stripe_mid=d8cfda3f-7aa8-4cb5-a472-357ebc94d8b228aeba; __stripe_sid=91514019-2bdf-4330-8dc0-26edf4aa42a1e4395c; mp_d105ce5cd51de6bfd5902f950038a82c_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24device_id%22%3A%20%221774517ba7958-0dd19bd6466f0f-13e3563-1fa400-1774517ba7a382%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_9a92fde9c1e57929204c3058109a9375_mixpanel=%7B%22distinct_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24device_id%22%3A%20%221774517ba622de-0752e05effce21-13e3563-1fa400-1774517ba632f6%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D',
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     return response.json();
  //   };

    const productDetails = await postData('https://www.7now.com/api/catalog/search/products', { query: tmpUrl, suggest: false });
    // const productDetails = await postData('https://www.7now.com/api/catalog/search/products', {"query":"Large Pizza   Pepperoni","suggest":false});
    console.log('productDetails::', productDetails);

    productDetails.Items.forEach((item, index) => {
      if (index == 0) {
        const allData = document.createElement('div');
        const productLongDesc = document.createElement('div');
        productLongDesc.setAttribute('class', 'product_longDesc');
        // productLongDesc.className = 'product_longDesc';
        productLongDesc.innerText = item.long_desc;
        allData.appendChild(productLongDesc);
  
        allData.setAttribute('class', 'json_items');
        const productId = document.createElement('div');
        productId.setAttribute('class', 'product_id');
        productId.innerText = item.slin;
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
        thumbnail.setAttribute('class', 'product_img');
        thumbnail.innerText = item.images[0];
        allData.appendChild(thumbnail);
        const price = document.createElement('div');
        price.setAttribute('class', 'product_price');
        price.innerText = '$' + item.catalog_price/100;
        allData.appendChild(price);
        const desc = document.createElement('div');
        desc.setAttribute('class', 'product_desc');
        desc.innerText = item.long_desc;
        allData.appendChild(desc);
        const catAll = document.createElement('div');
        catAll.setAttribute('class', 'product_cat');
        const cat = document.createElement('li');
        cat.setAttribute('class', 'cat');
        cat.innerText = item.category;
        catAll.appendChild(cat);
        const size = document.createElement('div');
        size.setAttribute('class', 'product_size');
        size.innerText = item.size_value;
        allData.appendChild(size);
        const calories = document.createElement('div');
        calories.setAttribute('class', 'product_calories');
        calories.innerText = item.calories + ' Cals';
        allData.appendChild(calories);
        const brand = document.createElement('div');
        brand.setAttribute('class', 'product_brand');
        brand.innerText = item.brand;
        allData.appendChild(brand);
        const subCat = document.createElement('li');
        subCat.setAttribute('class', 'cat');
        subCat.innerText = item.subcategory;
        catAll.appendChild(subCat);
        allData.appendChild(catAll);
        const upc = document.createElement('div');
        upc.setAttribute('class', 'product_upc');
        upc.innerText = item.upc;
        allData.appendChild(upc);

        const varinatId = document.createElement('div');
        varinatId.setAttribute('class', 'product_slin');
        varinatId.innerText = item.slin;
        allData.appendChild(varinatId);

        const category = document.createElement('div');
        category.setAttribute('class', 'product_category');
        category.innerText = item.category;
        allData.appendChild(category);

        // const availabilityMessage = document.createElement('div');
        // availabilityMessage.setAttribute('class', 'product_availability');
        // availabilityMessage.innerText = item.availabilityMessage;
        // allData.appendChild(availabilityMessage);
        document.body.appendChild(allData);
      }
    });
  }, tmpUrl);

  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: '7now',
    domain: '7now.com',
    loadedSelector: null,
    noResultsXPath: '//h2[@class="search__noResults-content-title"]/text()',
    zipcode: '',
  },
  implementation,
};
