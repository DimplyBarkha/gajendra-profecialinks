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
    const refURL1 = refURL.replace('sok', 'search');
    const fetchURL = `${refURL1}&size=150`;
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
      let j = 0
      const results = document.querySelectorAll('ax-product-grid[type-of-results="results"] > div > div > ax-product-puff.ax-product-grid-tile');
      const resultCount = results.length;
      const oneElement = document.querySelector('ax-product-grid[type-of-results="results"] > div > div > ax-product-puff.ax-product-grid-tile')
      const parentNode = oneElement.parentNode;
      const diff = prodCount - resultCount;
      while (j < diff) {
        try {
          var cln = oneElement.cloneNode(true);
          parentNode.appendChild(cln);
          j++;
        } catch (err) {}
      }
      const productCards = document.getElementsByClassName('ax-product-grid-tile');
      let i = 0;
      while (i < prodCount) {
        // if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
        //   document.getElementById(i.toString()).remove();
        // }
        addHiddenDiv(i, productCards, productInfo);
        i++;
      }
      return productCards.length;
    }

    function addHiddenDiv(i, productCards, productInfo) {
      const newDivUrl = document.createElement('div');
      newDivUrl.id = i;
      newDivUrl.className = 'extra-info-url';
      newDivUrl.style.display = 'none';
     
      const newDivId = document.createElement('div');
      newDivId.id = i;
      newDivId.className = 'extra-info-id';
      newDivId.style.display = 'none';

      const newDivPrice = document.createElement('div');
      newDivPrice.id = i;
      newDivPrice.className = 'extra-info-price';
      newDivPrice.style.display = 'none';

      const newDivName = document.createElement('div');
      newDivName.id = i;
      newDivName.className = 'extra-info-name';
      newDivName.style.display = 'none';

      const newDivThumbnail = document.createElement('div');
      newDivThumbnail.id = i;
      newDivThumbnail.className = 'extra-info-thumbnail';
      newDivThumbnail.style.display = 'none';

      const newDivManufacturer = document.createElement('div');
      newDivManufacturer.id = i;
      newDivManufacturer.className = 'extra-info-manufacturer';
      newDivManufacturer.style.display = 'none';
      
      
      if (productInfo && productInfo[i]) {
        let prodUrl = "https://www.willys.se/produkt/${name}";
        let name = productInfo[i].name + '-' + productInfo[i].code;
        name = name.replace(/\s+/g, '-');
        newDivUrl.textContent = `https://www.willys.se/produkt/${name}`;
        newDivId.textContent = productInfo[i].code;
        newDivPrice.textContent = productInfo[i].price;
        newDivName.textContent = productInfo[i].name;
        newDivThumbnail.textContent = productInfo[i].image.url;
        newDivManufacturer.textContent = productInfo[i].manufacturer;
      }
      if (productCards && productCards.item(i)) {
        productCards.item(i).appendChild(newDivUrl);
        productCards.item(i).appendChild(newDivId);
        productCards.item(i).appendChild(newDivPrice);
        productCards.item(i).appendChild(newDivName);
        productCards.item(i).appendChild(newDivThumbnail);
        productCards.item(i).appendChild(newDivManufacturer);
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
