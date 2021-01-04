const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform: transform,
    domain: 'liverpool.mx',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(() => {
      // function addHiddenDiv(id, content, index) {
      //     const newDiv = document.createElement('div');
      //     newDiv.id = id;
      //     newDiv.textContent = content;
      //     newDiv.style.display = 'none';
      //     const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[index];
      //     originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      // }
      var productdata = document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext() ? document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent : "";
      var productInfoJson = JSON.parse(productdata);
      console.log(productInfoJson)
      // var brandBlock1 = document.querySelector('head > script:nth-child(99)');
      // @ts-ignore
      //const lengthArray = productInfoJson.itemListElement.length;
      // @ts-ignore
      const itemList = productInfoJson.itemListElement;
      // alert(itemList[0].item)
      // for (let i = 0; i <itemList.length; i++) {
      //     if (Object.keys(itemList[i].item.aggregateRating).length > 1) {
      //         const finalValue = itemList[i].item.aggregateRating.ratingValue
      //         const url = itemList[i].item.url
      //         addHiddenDiv('finalValue', finalValue, i);
      //         addHiddenDiv('url', url, i);
      //         i++;
      //     }
      //     else{
      //         i++;
      //     }
      //     // var finalValue = itemList[i].item.url
      //     // console.log("test" + finalValue)
      // }
      if (itemList && itemList.length) {
        for (let i = 0; i < itemList.length; i++) {
          if (Object.keys(itemList[i].item.aggregateRating).length > 1) {
            const finalValue = itemList[i].item.aggregateRating.ratingValue
            if (finalValue !== 'undefined') {
              const newDiv = document.createElement('div');
              const newDivUrl = document.createElement('url');
              newDiv.id = 'rating';
              newDivUrl.id = 'url';
              newDiv.textContent = finalValue;
              newDivUrl.textContent = itemList[i].item.url;
              newDiv.style.display = 'none';
              const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[i];
              originalDiv.parentNode.insertBefore(newDiv, originalDiv);
              originalDiv.parentNode.insertBefore(newDivUrl, originalDiv);
            }
          }
          else {
            const newDiv = document.createElement('div');
            newDiv.id = 'rating';
            newDiv.textContent = "0";
            newDiv.style.display = 'none';
            const newDivUrl = document.createElement('url');
            newDivUrl.id = 'url';
            newDivUrl.textContent = itemList[i].item.url;
            const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[i];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
            originalDiv.parentNode.insertBefore(newDivUrl, originalDiv);
          }
        }

        var price = document.querySelectorAll("p.a-card-discount");
        if (price) {
          for (let i = 0; i < price.length; i++) {
            const fprice = document.querySelectorAll("p.a-card-discount")[i].textContent.replace(",", "").match(/(\d+)(\d{2})/)[1];
            const lprice = document.querySelectorAll("p.a-card-discount")[i].textContent.replace(",", "").match(/(\d+)(\d{2})/)[2];
            const finalPrice = fprice + '.' + lprice;
            const newDiv = document.createElement('div');
            newDiv.id = 'price';
            newDiv.textContent = finalPrice;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[i];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
          }
        }
      }

      // @ts-ignore
      //console.log("json" + JSON.parse(brandBlock1.innerText).itemListElement[1].item.aggregateRating.ratingValue);
      // addHiddenDiv('finalValue', finalValue, i);
      let productPrice = document.querySelector("div.m-product__price--collection");
      if (productPrice) {
        const fprice = document.querySelector("div.m-product__price--collection") ? document.querySelector("div.m-product__price--collection").textContent.replace(",", "").match(/(\d+)(\d{2})/)[1] : '';
        const lprice = document.querySelector("div.m-product__price--collection") ? document.querySelector("div.m-product__price--collection").textContent.replace(",", "").match(/(\d+)(\d{2})/)[2] : '';
        const finalPrice = fprice + '.' + lprice;
        document.body.querySelector("#__next > div.alert-top-defult").setAttribute('price', finalPrice);
      }

      let pUrl = document.querySelector("#__next > div.alert-top-defult");
      if(pUrl) {
        let url = window.location.href;
        let id = url.match(/(\/)(\d+)/)[2];
        let formUrl = url+'?skuId='+id;
        document.querySelector("#__next > div.alert-top-defult").setAttribute('url', formUrl);
      }
      let rating = document.querySelector("#TurnToReviewsContent > div.TTreviewSummary span");
      if(!rating && pUrl){
        document.querySelector("#__next > div.alert-top-defult").setAttribute('rating', '0');
      }
    });
    
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
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
      });
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
}