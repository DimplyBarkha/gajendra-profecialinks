// const { addAlias } = require('module-alias');
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    transform: transform,
    domain: 'otto.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      let scrollTop = 0;
      // function addHiddenDiv(id, content, index) {
      //   const newDiv = document.createElement('div');
      //   newDiv.id = id;
      //   newDiv.textContent = content;
      //   newDiv.style.display = 'none';
      //   //const originalDiv = document.querySelectorAll('#san_resultSection > article')[index];
      //   const originalDiv = document.querySelectorAll("script[type='application/ld+json']")[index];
      //   originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      // }
      try{
        while (scrollTop !== 20000) {
          await stall(1000);
          var aa = document.querySelectorAll("span[class='name']");
          var az = document.querySelectorAll("li[id='san_pagingBottomNext'] button");
          if (aa != null) {
            for (var i = 0; i < aa.length; i++) {
              console.log('h',i)
            }
          }
          scrollTop += 500;
          //name
          window.scroll(0, scrollTop);
          
          if (az==null){
            break;
          }
          if (scrollTop === 20000) {
            await stall(2000);
            break;
          }
  
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      }
      catch(error) {}
      
      // var tempData, valueVariant, valueRating;
      // const rawData = document.querySelectorAll('script[type="application/ld+json"]');
      // for (let i = 0; i < rawData.length; i++) {
      //   try {
      //     // @ts-ignore
      //     tempData = rawData[i].innerText;
      //     tempData = JSON.parse(tempData);
      //     valueRating = tempData.aggregateRating[0].ratingValue;
      //     valueVariant = tempData.additionalProperty[0].value;
      //     const newDiv = document.createElement('div');
      //     newDiv.id = 'rating';
      //     newDiv.textContent = valueRating;
      //     newDiv.style.display = 'none';
      //     const originalDiv = document.querySelectorAll("article[data-variationid=\"" + valueVariant + "\"]")[0];
      //     // @ts-ignore
      //     originalDiv.parentNode.insertBefore(newDiv, originalDiv);

      //   } catch (error) {
      //     continue;
      //   }
      // }
      // function addHiddenDiv(id, content, index) {
      //   const newDiv = document.createElement('div');
      //   newDiv.id = id;
      //   newDiv.textContent = content;
      //   newDiv.style.display = 'none';
      //   //const originalDiv = document.querySelectorAll('#san_resultSection > article')[index];
      //   const originalDiv = document.querySelectorAll("script[type='application/ld+json']")[index];
      //   originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      // }


      // var aa = document.querySelectorAll("script[type='application/ld+json']");
      // if (aa != null) {
      //   for (var i = 0; i < aa.length; i++) {
      //     // @ts-ignore
      //     var rawjson = JSON.parse(aa[i].innerText)
      //     //var newname = rawjson.name
      //     addHiddenDiv('newname', rawjson.name, i)
      //     addHiddenDiv('price', rawjson.offers[0].price, i)
      //     addHiddenDiv('img', rawjson.image, i)
      //     addHiddenDiv('url', 'https://www.otto.de' + rawjson.url, i)
      //     addHiddenDiv('brand', rawjson.brand, i)
      //     var prodid = rawjson.url.split('/#variationId=')[1]
      //     addHiddenDiv('prodid', prodid, i)
      //     try {
      //       addHiddenDiv('aggr', rawjson.aggregateRating[0].ratingValue, i)
      //     }
      //     catch (error) { }
      //     try {
      //       addHiddenDiv('review', rawjson.aggregateRating[0].reviewCount, i)
      //     }
      //     catch (error) { }


      //   }
      // }

      // price 
      // var price = getAllXpath("//span[@class='value']/text()", 'nodeValue');
      // if (price != null) {
      //   for (var i = 0; i < price.length; i++) {
      //     price[i] = price[i].replace(",", ".")
      //     addHiddenDiv('price', price[i], i);
      //   }
      // }
      // var prodid = getAllXpath("//article[@class='product']/@data-facetted-variation-ids", 'nodeValue');
      // if (prodid != null) {
      //   for (var i = 0; i < prodid.length; i++) {
      //     prodid[i] = prodid[i].split(",")[0]
      //     addHiddenDiv('prodid', prodid[i], i);
      //   }
      // }

    });
    return await context.extract(productDetails, { transform });
  },
};