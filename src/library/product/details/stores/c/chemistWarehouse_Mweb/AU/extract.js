const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let list = await context.evaluate(() => !document.querySelector('div.search__result__product__list'))
  if (!list) {
    async function firstItemLink() {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('div.search__result__product__image-holder a')
        // @ts-ignore
        firstItem = firstItem ? firstItem.href : '';
        return firstItem;
      });
    }
    const url = await firstItemLink();
    console.log('url: ', url);

    if ((url !== null) && (url !== '')) {
      await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }
  await context.evaluate(() => {
    let boxInStoreOnly  = document.querySelectorAll('div.Add2Cart.boxInStoreOnly');
    let boxLowStock     = document.querySelectorAll('div.Add2Cart.boxLowStock');
    let outOfStockElem  = document.querySelector('div.boxOutOfStock');
    let skuElement      = document.getElementById('skuId');
    let availabilityText = 'In stock';
    var mainElem = document.getElementById('Left-Content');
    let url = window.location.pathname;
    
    function isHidden(el) {
      if(el){
        return (el.offsetParent === null)
      } else {
        return false;
      }
    }
    
    if(boxLowStock.length){
      boxLowStock.forEach(element => {
        if(!isHidden(element)){
          availabilityText = 'Click and Collect'; 
        }
      });
    }
   
    if(boxInStoreOnly.length){
      boxInStoreOnly.forEach(element => {
        console.log(element);
        if(!isHidden(element)){
          availabilityText = 'Click and Collect'; 
        }
      });
    }
    
    if(outOfStockElem){
      if(!isHidden(outOfStockElem)){
        availabilityText = 'Out of Stock';
      }
    }

    if(!skuElement){
      availabilityText = 'Out of Stock';
    }

    if(!skuElement){
      let Id = url.split('/')[2];
      var input = document.createElement("input");
      input.setAttribute('type', 'hidden');
      input.id = "skuId";
      input.value = Id; 
      mainElem.appendChild(input);
    }

    var divElement = document.createElement("Div");
    divElement.id = "availabilityText";
    divElement.innerText = availabilityText;
    mainElem.appendChild(divElement);

    let descContentElems = document.querySelectorAll('div.product-info-container');
    let pipeCount         = 0;
    if(descContentElems.length){
      let descContent =  descContentElems[1].innerHTML;
      pipeCount = (descContent.match(new RegExp("•", "g")) || []).length;
      console.log('pipe count', pipeCount);
    }

    setTimeout(()=>{
      var divElement = document.createElement("Div");
      divElement.id = "pipeCount";
      // @ts-ignore
      divElement.innerText = pipeCount;
      mainElem.appendChild(divElement);
    }, 100);
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  return await context.extract(productDetails, { transform });
}
