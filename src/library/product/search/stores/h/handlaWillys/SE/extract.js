const { transform } = require('../../../../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 15000));
  await context.evaluate(async function () {
    let productInfo = [];
    const refURL = window.location.href;
    const fetchURL = refURL.replace('sok', 'search');
    console.log('fetchURL: ', fetchURL);

    const response = await fetch(fetchURL, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
      },
      referrer: refURL,
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
    });

    if (response && response.status === 400) {
      throw new Error('Error when calling API');
    }

    if (response && response.status === 404) {
      console.log('Product Not Found!!!!');
    }

    if (response && response.status === 200) {
      console.log('Product Found!!!!');
      const data = await response.json();
      productInfo = data.results;
      const prodCount = productInfo.length;
      const productCards = document.getElementsByClassName('ax-product-grid-tile');
      let i = 0;
      while (i < prodCount) {
        if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
          document.getElementById(i.toString()).remove();
        }
        addHiddenDiv(i, productCards, productInfo);
        i++;
      }
    }

    function addHiddenDiv(i, productCards, productInfo) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info-url';
      newDiv.style.display = 'none';
     
      const newDivId = document.createElement('div');
      newDivId.id = i;
      newDivId.className = 'extra-info-id';
      newDivId.style.display = 'none';

      if (productInfo && productInfo[i]) {
        let prodUrl = "https://www.willys.se/produkt/${name}";
        let name = productInfo[i].name + '-' + productInfo[i].code;
        name = name.replace(/\s+/g, '-');
        newDiv.textContent = `https://www.willys.se/produkt/${name}`;
        newDivId.textContent = productInfo[i].code;
      }
      if (productCards && productCards.item(i)) {
        productCards.item(i).appendChild(newDiv);
        productCards.item(i).appendChild(newDivId);
      }
    }

    const searchUrl = window.location.href.replace('%20', ' ');
    const hiddenSearchDiv = document.createElement('div');
    hiddenSearchDiv.id = 'search-url';
    hiddenSearchDiv.style.display = 'none';
    hiddenSearchDiv.textContent = searchUrl;
    document.body.appendChild(hiddenSearchDiv);

  });

  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'handlaWillys',
    transform: transform,
    domain: 'willys.se',
    zipcode: '',
  },
  implementation,
};
