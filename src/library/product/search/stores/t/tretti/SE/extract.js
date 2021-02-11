const { transform } = require('../../../../shared');
// @ts-nocheck
async function implementation (
  inputs,
  parameters,
  context,
  dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // const applyScroll = async function (context) {
  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop !== 10000) {
  //       await stall(1000);
  //       scrollTop += 1000;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 10000) {
  //         await stall(1000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  // };
  // await applyScroll(context);

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    var referenceText = 'var vueData =';
    let productInfo = document.querySelector('#content > script').innerText;
    productInfo = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.lastIndexOf('}') + 1));
    console.log(productInfo);

    for (var k = 0; k < productInfo.listing.length; k++) {
      if (productInfo.listing[k]._6 != null || productInfo.listing[k]._6 != undefined) {
        var prodId = productInfo.listing[k]._6;
      }
      if (productInfo.listing[k]._14 != null || productInfo.listing[k]._14 != undefined) {
        var prodPrice = productInfo.listing[k]._14;
      } else {
        prodPrice = 0;
      }
      if (productInfo.listing[k]._9 != null || productInfo.listing[k]._9 != undefined) {
        var prodName = `${productInfo.listing[k]._1}, ${productInfo.listing[k]._9}`;
      }
      if (productInfo.listing[k]._4 != null || productInfo.listing[k]._4 != undefined) {
        var prodRating = productInfo.listing[k]._4;
      }
      if (productInfo.listing[k]._3 != null || productInfo.listing[k]._3 != undefined) {
        var prodUrl = `https://www.tretti.se/${productInfo.listing[k]._3}`;
      }
      if (productInfo.listing[k]._2 != null || productInfo.listing[k]._2 != undefined) {
        var prodThumbnail = `https://images2.wagcdn.com/705/600/${productInfo.listing[k]._2}`;
      }

      addHiddenDiv('pid', prodId);
      addHiddenDiv('prodPrice', prodPrice);
      addHiddenDiv('prodName', prodName);
      addHiddenDiv('prodRating', prodRating);
      addHiddenDiv('prodUrl', prodUrl);
      addHiddenDiv('prodThumbnail', prodThumbnail);
    }
    // await context.evaluate(() => {
    //   function addHiddenDiv (el, myClass, content) {
    //     const newDiv = document.createElement('div');
    //     newDiv.setAttribute('class', myClass);
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     el.appendChild(newDiv);
    //   }

    //   const aggregateRating =document.querySelectorAll('.star-rating__front');
    //   for(let k = 0; k < aggregateRating.length;k++){
    //   // @ts-ignore
    //     let singleRating = aggregateRating[k].style.width;
    //     singleRating = singleRating.slice(0, singleRating.length - 1);
    //     singleRating = (5 * singleRating )/100;
    //     singleRating = singleRating.toFixed(1);
    //     addHiddenDiv(aggregateRating[k],'aggregateRating', singleRating);
    //   }

    //   function preFetchProductDetails () {
    //     var referenceText = 'var vueData ='
    //     let productInfo = document.querySelector('#content > script:nth-child(6)').innerText;
    //     productInfo = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.lastIndexOf('}') + 1));
    //     console.log(productInfo);
    //     return productInfo;
    //   }
    //     // var id = preFetchProductDetails();
    //     // for(var k=0;k<id.listing.length;k++){
    //     //   var prodId = id.listing[k]._1;
    //     //   console.log('12$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    //     //   addHiddenDiv(id.listing[k],"pid", prodId);
    //     // }

    //   var id = preFetchProductDetails();
    //   const itemContainers = document.querySelectorAll('#content > div.srp > div.srp-body > div.srp-product-wrap > div.srp-product-wrap__product-list.list > div > div > div.srp-product-box__content-wrapper');
    //     // let rank = 1;
    //   let k = 0;
    //   for (const itemContainer of itemContainers) {
    //     console.log(itemContainer);
    //     // const totalRank = itemContainer + rank;
    //     var prodId = id.listing[k]._6;
    //     addHiddenDiv(itemContainer,"pid", prodId);

    //     k++;
    //       // addHiddenDiv(itemContainer, 'rank', totalRank);
    //       // rank++;
    //   }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'tretti',
    transform: transform,
    domain: 'tretti.se',
    zipcode: '',
  },
  implementation,
};
