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
  //implementation,
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
      let wrapper_Magic = document.querySelector('div.wrapper-Magic360');
      let sku_cwhhtml   = document.getElementById('sku_cwhhtml');
      let general_info  = document.querySelectorAll('section.product-info-section.general-info > .details')[1];  
      let detailElem    = document.querySelector('section.product-info-section.description > .details');
      if(sku_cwhhtml != null || wrapper_Magic != null){
        detailElem.innerHTML = '';
        detailElem.innerHTML = general_info.innerHTML;
      }
  });
  return await context.extract(productDetails, { transform });
}
