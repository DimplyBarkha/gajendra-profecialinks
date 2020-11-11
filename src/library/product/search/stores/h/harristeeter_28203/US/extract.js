async function implementation (
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

    console.log('getDataFromAPI');
    let data = {};
    const fetchURL = 'https://www.harristeeter.com/shop/api/v1/el/stores/C217228/products/search?Q=${encodeURIComponent(keywords)}&WithCart=false&UserId=0dcfda6e-b8cc-442a-a25c-b9c6b9824afd&Page=1&Limit=20&IsMember=false&AllowAlcohol=true&Sort=Relevance';
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
      console.log('category');
      console.log(typeof (data.Data.Items));
      console.log(Object.keys(data.Data.Items).length);
      Object.keys(data.Data.Items).forEach((prop) => console.log('here ' + prop));

      data.Data.Items.forEach((category) => {
        console.log('category');
        console.log(category);
        // const name = category.Name;
      });
    }
    // Object.keys(searchResults).forEach((prop) => console.log('here ' + prop));
    // var myObjStr = JSON.stringify(searchResults);
    // console.log(myObjStr);
    // console.log(searchResults.Data.Items);
    // if (!searchResults.Data.Items) return;
    // searchResults.Data.Items.forEach((category) => {
    //   const name = category.Name;
    //   console.log(name);
    //   // const img = category.rangeImageUrl || '';
    //   // if (category.associatedProducts) {
    //   //   category.associatedProducts.forEach((product) => {
    //   //     const row = addElementToDocument('added_row', '');
    //   //     const listPrice = product.price ? product.price.formattedValue : '';
    //   //     const price = product.reducedPrice ? product.reducedPrice.formattedValue : listPrice;
    //   //     const isDiscontinued = product.discontinued;
    //   //     const name = product.webName || '';
    //   //     const prefix = name && name.includes(brand) ? '' : brand;
    //   //     row.setAttribute('added_productURL', `${domain}${product.productURL}`);
    //   //     row.setAttribute('added_brand', brand);
    //   //     row.setAttribute('added_thumbnail', img);
    //   //     row.setAttribute('added_sku', product.code || '');
    //   //     row.setAttribute('added_mpc', product.mpc || '');
    //   //     row.setAttribute('added_name', name);
    //   //     row.setAttribute('added_price', isDiscontinued ? '' : price);
    //   //     row.setAttribute('added_listPrice', isDiscontinued || listPrice === price ? '' : listPrice);
    //   //     row.setAttribute('added_nameExtended', `${prefix ? prefix + ' - ' : ''}${name}`);
    //   //   });
    //   // } else {
    //   //   const row = addElementToDocument('added_row', '');
    //   //   const name = category.name || '';
    //   //   row.setAttribute('added_productURL', `${domain}${category.url}`);
    //   //   row.setAttribute('added_brand', brand);
    //   //   row.setAttribute('added_thumbnail', img);
    //   //   row.setAttribute('added_name', name);
    //   //   row.setAttribute('added_nameExtended', name);
    //   // }
    // });
  }, domain, country, keywords);

  return await context.extract(productDetails, { transform: parameters.transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28203',
    transform: null,
    domain: 'harristeeter.com',
    zipcode: '',
  },
  implementation,
};
