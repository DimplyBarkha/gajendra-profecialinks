const { transform } = require('../../../../shared');
<<<<<<< HEAD
const implementation = async function (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
const applyScroll = async function (context) {
await context.evaluate(async function () {
let scrollTop = 0;
while (scrollTop !== 3000) {
scrollTop += 1000;
window.scroll(0, scrollTop);
await stall(1000);
}
function stall (ms) {
return new Promise((resolve, reject) => {
setTimeout(() => {
resolve();
}, ms);
});
}
});
};
await applyScroll(context);
async function getProductsCount (context) {
return context.evaluate(async function () {
const products = document.evaluate('//li[@class="product-tile-group__list__item"]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
return products.snapshotLength;
});
}
let productsCount = 0;
while (productsCount < 150) {
const doesLoadMoreExists = await context.evaluate(function () {
return Boolean(document.querySelector('button.primary-button.primary-button--load-more-button'));
});
if (doesLoadMoreExists) {
await context.evaluate(async function () {
console.log('Clicking on load more button');
// @ts-ignore
document.querySelector('button.primary-button.primary-button--load-more-button').click();
await new Promise((resolve, reject) => setTimeout(resolve, 10000));
});
productsCount = await getProductsCount(context);
console.log('productsCount' + productsCount);
if (productsCount >= 150) {
break;
}
await applyScroll(context);
} else {
break;
}
}
return await context.extract(productDetails, { transform });
};
=======
>>>>>>> 925fa7fbf830ff316326e0a824cce53636541c54
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

