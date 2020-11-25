const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  await context.evaluate(async function () {
    function addHiddenDiv (i, productCards, divId, value) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = `extra-info-${divId}`; // 'extra-info-id';
      newDiv.style.display = 'none';
      if (value) {
        newDiv.textContent = value;
      }
      productCards.item(i).appendChild(newDiv);
    }
    let search = '';
    const URL = window.location.href;
    const qText = 'query=';
    if (URL.indexOf(qText) > -1) {
      search = URL.substring(URL.indexOf(qText) + qText.length);
    }
    const page = 1;
    const size = 40;
    const query = search;
    console.log('query ==  ', query);
    const body = {
      query: query,
      stores: [990002972],
      page: page,
      size: size,
    };

    const response = await fetch(`https://services.mxgrability.rappi.com/api/es-proxy/search/v2/products?page=${page}`, {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
    });
    const data = await response.json();
    const prods = data.hits;

    const productCards = document.getElementsByClassName('product-container ng-star-inserted');

    let i = 0;
    while (i < productCards.length) {
      const ele = prods[i];
      addHiddenDiv(i, productCards, 'id', ele.id);
      addHiddenDiv(i, productCards, 'image', ele.image);
      addHiddenDiv(i, productCards, 'name', ele.name);
      addHiddenDiv(i, productCards, 'price', ele.price);
      addHiddenDiv(i, productCards, 'ean', ele.ean);
      i++;
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'rappi_chedraui',
    transform: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
};
