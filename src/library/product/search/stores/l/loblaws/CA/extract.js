const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    transform: transform,
    domain: 'loblaws.ca',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await await context.evaluate(async function () {
    function addEmptyDiv() {
      const newDiv = document.createElement('div');
      newDiv.className = 'results';
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.getElementsByClassName('results')[index].appendChild(newDiv);
    }
    let url = window.location.href;
    let keywords = url.split('=')[1].replace(/%20/g, ' ').replace(/%26/g, '&').replace(/%27/g, '\'');
    let pageNumber = 0;
    let totalLength = 0;
    let responseData = async function () {
      let body = {
        pagination: { "from": pageNumber, "size": 48 },
        banner: 'loblaw',
        lang: 'en',
        storeId: 1032,
        inventoryInfoRequired: true,
        cartId: '05f21b6e-aacd-43a4-8840-5797a1b5db31',
        term: keywords,
      };
      const response = await fetch("https://api.pcexpress.ca/v2/products/search", {
        "headers": {
          "content-type": "application/json;charset=UTF-8",
          "x-apikey": "1im1hL52q9xvta16GlSdYDsTsG0dmyhF"
        },
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
      });
      const data = await response.clone().json();
      totalLength = data.pagination.totalResults;
      return data.results;
    }
    let finalData = await responseData();
    while (finalData.length < totalLength && finalData.length < 150) {
      pageNumber++;
      let data = await responseData();
      finalData = [...finalData, ...data]
    }
    let name;
    for (let i = 0; i < finalData.length; i++) {
      addEmptyDiv();
      addHiddenDiv('ID', finalData[i].articleNumber, i);
      addHiddenDiv('Price', finalData[i].prices.price.value, i);
      addHiddenDiv('ProdURL', finalData[i].link, i);
      addHiddenDiv('Image', finalData[i].imageAssets[0].largeUrl, i);
      if (finalData[i].brand) {
        name = finalData[i].brand + ', ' + finalData[i].name;
      }
      else {
        name = finalData[i].name;
      }
      if (finalData[i].packageSize) {
        name += '(' + finalData[i].packageSize + ')';
      }
      addHiddenDiv('Name', name, i);
    }
  });
  return await context.extract(productDetails, { transform });
};

