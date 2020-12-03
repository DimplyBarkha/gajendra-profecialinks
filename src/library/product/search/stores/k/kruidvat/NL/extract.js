const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform,
    domain: 'kruidvat.nl',
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
  await context.waitForXPath('//div[@class="tile__product-slide-rating-wrapper"]');
  // await context.waitForXPath('//div[@class="tile__product-slide-rating-wrapper"]');
  // await stall(2000);
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      await stall(500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 1000) {
        await stall(500);
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
  
  
  function addHiddenDiv(id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv = document.querySelectorAll("div[class='rating']")[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  const aggregateRating = document.querySelectorAll("e2-rating")
  for (let k = 0; k < aggregateRating.length; k++) {
  // @ts-ignore
  let singleRating = aggregateRating[k].getAttribute("reviews-number");
  // singleRating = singleRating.slice(0, singleRating.length - 1)
  // singleRating = (5 * singleRating) / 100;
  // singleRating = singleRating.toFixed(1);
  console.log(singleRating,'=singleRating')
  addHiddenDiv('aggregateRating', singleRating, k);
  }
  function addHiddenDiv1(id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv1 = document.querySelectorAll("div[class='pricebadge__new-price']")[index];
    originalDiv1.parentNode.insertBefore(newDiv, originalDiv1);
  }
  const priceDecimal = document.querySelectorAll("div[class='pricebadge__new-price-decimal']")
  const priceDecimal1 = document.querySelectorAll("div[class='pricebadge__new-price-separator']")
  const priceDecimal2 = document.querySelectorAll("div[class='pricebadge__new-price-fractional']")
  for (let k = 0; k < priceDecimal.length; k++) {
    let singleDecimal=priceDecimal[k].innerHTML
    let singleDecimal1=priceDecimal1[k].innerHTML
    let singleDecimal2=priceDecimal2[k].innerHTML
    let price_rate= singleDecimal + singleDecimal1 +singleDecimal2
    addHiddenDiv1('price_rate', price_rate, k);
  }

});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
