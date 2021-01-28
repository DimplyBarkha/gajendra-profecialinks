const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  const { transform }       = parameters;
  const { productDetails }  = dependencies;
  
  
  
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

      // const descContent = (document.querySelector('div.product-info-container')) ? document.querySelector('div.product-info-container').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      // console.log(descContent);

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
      // let wrapper_Magic = document.querySelector('div.wrapper-Magic360');
      // let sku_cwhhtml   = document.getElementById('sku_cwhhtml');
      // let general_info  = document.querySelectorAll('section.product-info-section.general-info > .details')[1];  
      // let detailElem    = document.querySelector('section.product-info-section.description > .details');
      // if(sku_cwhhtml != null || wrapper_Magic != null){
      //   detailElem.innerHTML = '';
      //   detailElem.innerHTML = general_info.innerHTML;
      // }
  });
  return await context.extract(productDetails, { transform });
}
