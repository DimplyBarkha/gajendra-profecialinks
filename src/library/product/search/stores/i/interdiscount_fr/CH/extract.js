
const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
 
  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('section > div:last-child li:last-child>a');
    // @ts-ignore
    let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
    let yPos = 0;
    while (scrollLimit && yPos < scrollLimit) {
      yPos = yPos + 500;
      window.scrollTo(0, yPos);
      scrollSelector = document.querySelector('section > div:last-child li:last-child>a');
      // @ts-ignore
      scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });
   /*
  try {
    await context.waitForSelector('section > div:last-child li:last-child>a');
  } catch (error) {
    console.log('img content not loaded');
  }*/
  await context.evaluate(async function () {
    // @ts-ignore
    const productInfo = window.__INITIAL_STATE__.products;

    async function addEleToDoc (key, value, code) {
      const productCode = new RegExp(`--p${code}`, 'g');
      const productsDiv = document.querySelectorAll('div._3oe9VX');
      const productDiv = Array.from(productsDiv, ele => ele.innerHTML);
      const filteredDiv = productDiv.filter(element => element.match(productCode));
      // console.log("code::: ", code);
      // console.log("filteredDiv:: ", filteredDiv);
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      if (filteredDiv && filteredDiv.length) {
        const doc = new DOMParser().parseFromString(filteredDiv[0], 'text/xml');
        // if (!doc.getElementById('rating')) {
          // @ts-ignore
          const href = doc.querySelector('a.Q_opE0').getAttribute('href');
          if (href) {
            document.querySelector(`a[href='${href}']`).appendChild(prodEle);
            // await new Promise(resolve => setTimeout(resolve, 500));
          }else{
            console.log("########################## href not found to add rating")
          }
        // }
      }
    }
    if (productInfo) {
      const info = Object.keys(productInfo);
      const URL = window.location.href;
      for (var i = 0; i < info.length; i++) {
        console.log('inside loop :::: i====', info[i]);
        var code = info[i];
        var item = productInfo[code].code;
        // console.log("item:::: ", item)
        var aggregateRating = productInfo[code].averageRating;
        // console.log("aggregateRating:::: ", aggregateRating)
        if (item && aggregateRating > 0) {
          addEleToDoc('rating', `${aggregateRating}`, `${item}`);
        }
        addEleToDoc('pd_url', URL, `${item}`);
      }
    }
  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    transform,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
  implementation,
};
