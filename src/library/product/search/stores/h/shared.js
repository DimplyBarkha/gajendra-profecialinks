
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { domain, country } = parameters;
  const { keywords } = inputs;

  await context.evaluate(async (domain, country, keywords) => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
    }

    const storeMapping = {
      412: 'FCE4123709',
      66: 'C217228',
      61: 'AAA03995',
    };

    let data = {};
    var pageNo = 1;
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('pageNo');
    var pathname = new URL(window.location.href).pathname;
    var searchKey = pathname.split('search/')[1];
    var storeId = window.location.href.substring(window.location.href.lastIndexOf('store/') + 6, window.location.href.lastIndexOf('/search'));
    console.log('storeId');
    console.log(storeId);
    if (myParam) {
      pageNo = parseInt(myParam);
    }
    const fetchURL = `https://www.harristeeter.com/shop/api/v1/el/stores/${storeMapping[storeId]}/products/search?Q=${(searchKey)}&WithCart=false&UserId=0dcfda6e-b8cc-442a-a25c-b9c6b9824afd&Page=${pageNo}&Limit=20&IsMember=false&AllowAlcohol=true&Sort=Relevance`;
    const windowUrl = window.location.href.split('search');
    const baseUrl = windowUrl[0];
    const referrer = window.location.href;
    console.log('fetchURL');
    console.log(fetchURL);
    const searchResults = await fetch(fetchURL, {
      // @ts-ignore
      accept: 'application/json, text/plain, */*',
      referrer: referrer,
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
    });

    if (searchResults && searchResults.status === 404) {
      console.log('Product Not Found!!!!');
      return;
    }

    if (searchResults && searchResults.status === 200) {
      data = await searchResults.json();
      data.Data.Items.forEach((category) => {
        const row = addElementToDocument('added_row', '');
        const name = category.Brand + ' ' + category.Name;
        const id = category.Sku;
        const image = category.ImageLinks;
        const price = category.CurrentPrice;
        image.forEach(element => {
          if (element.Rel === 'large') {
            const thumbnail = element.Uri;
            row.setAttribute('added_thumbnail', thumbnail);
          }
        });
        const prodUrl = baseUrl + 'product/' + id + '/details/selected';
        row.setAttribute('added_name', name);
        row.setAttribute('added_url', prodUrl);
        row.setAttribute('added_id', id);
        row.setAttribute('added_price', price);
      });
    }
  }, domain, country, keywords);

  return await context.extract(productDetails, { transform: parameters.transform });
};
