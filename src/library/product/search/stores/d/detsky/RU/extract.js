const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //   let scrollTop = 0;
  //   while (scrollTop !== 20000) {
  //   await stall(500);
  //   scrollTop += 1000;
  //   window.scroll(0, scrollTop);
  //   if (scrollTop === 20000) {
  //   await stall(5000);
  //   break;
  //   }
  //   }
  //   function stall (ms) {
  //   return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //   resolve();
  //   }, ms);
  //   });
  //   }
  //   });
  //   };
  //   await applyScroll(context);

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (document.querySelector('#app-data')) {
      var data = document.querySelector('#app-data').innerText;

      var jsonData = JSON.parse(data.replace(/&quot;/g, '"'));
      var items = jsonData.catalog.data.items;
      for (var k = 0; k < items.length; k++) {
        const searchUrl = window.location.href;
        addHiddenDiv('search-url', searchUrl);
        if (items[k].productId != null || items[k].productId != undefined) {
          var prodId = items[k].productId;
          // console.log(prodId, "**************************************************************************");
        }
        if (items[k].link != null || items[k].link != undefined) {
          var prodUrl = items[k].link.web_url;
        }
        if (items[k].pictures != null || items[k].pictures != undefined) {
          var prodThumbnail = items[k].pictures[0].original;
        }
        if (items[k].title != null || items[k].title != undefined) {
          var prodName = items[k].title;
        }
        if (items[k].rating != null || items[k].rating != undefined) {
          if (items[k].rating != 0) {
            var prodRating = items[k].rating.toFixed(1);
          } else {
            prodRating = '';
          }
        }
        if (items[k].review_count != null || items[k].review_count != undefined) {
          // console.log(items[k].review_count)
          if (items[k].review_count != 0) {
            var prodReview = items[k].review_count;
          } else {
            prodReview = '';
          }
        }
        if (items[k].price !== null || items[k].price !== undefined) {
          if (items[k].price.price != 0) {
            var prodPrice = items[k].price.price;
          } else {
            prodPrice = '';
          }
        }

        addHiddenDiv('pid', prodId);
        addHiddenDiv('prodUrl', prodUrl);
        addHiddenDiv('prodThumbnail', prodThumbnail);
        addHiddenDiv('prodName', prodName);
        addHiddenDiv('prodRating', prodRating);
        addHiddenDiv('prodReview', prodReview);
        addHiddenDiv('prodPrice', prodPrice);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'detsky',
    transform: transform,
    domain: 'detmir.ru',
    zipcode: '',
  },
  implementation,
};
