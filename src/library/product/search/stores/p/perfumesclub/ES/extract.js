const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'perfumesclub',
    transform: transform,
    domain: 'perfumesclub.com',
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
      // const rating12=document.querySelectorAll("div[class='quedanMenos']")

      // for(let i=0;i<=rating12.length;i++)
      // {
      // let ratingValue1=rating[i].lastElementChild.alt;console.log(ratingValue1)
      // }
      // addHiddenDiv('aggregateRating', singleRating, i);
    }
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[id*="productList"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }

    const rating = document.querySelectorAll("div[class='quedanMenos']")

    for (let i = 0; i <= rating.length; i++) {
      //ts-ignore
      if (i < rating.length) {
        ratingValue = rating[i].lastElementChild.alt; console.log(ratingValue)
      }
      addHiddenDiv('aggregateRating', ratingValue.replace('stars', '').replace('.',','), i);
    }

  });
  return await context.extract(productDetails, { transform });
}