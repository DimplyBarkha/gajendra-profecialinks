const { transform } = require('./variantFormat');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;

  try{
    await context.waitForSelector('div[data-automation="colour-select-container"]>div[class="select-wrapper"]>button[data-automation="select-colour"]');
    await context.click('div[data-automation="colour-select-container"]>div[class="select-wrapper"]>button[data-automation="select-colour"]');
    ////div[@class="drawers-container"]//ul[@data-automation="drawer-body"]/li
  }catch(e){
    
  }
  
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  //await context.evaluate(function () {
    //document.body.setAttribute('currentURL',window.location.href.replace(/#.*/,''));
  //})*/

  await context.evaluate(function () {
    function addHiddenDiv(className, content) {
      const newDiv = document.createElement('div');
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      return newDiv;
    }
    let url = window.location.href.replace(/#.*/,'');
    url=url.split('?')[0];
    const outerDiv = addHiddenDiv('variants_outer', '');
    if (document.querySelector('div.drawers-container ul[data-automation="drawer-body"]>li')) {
      document.querySelectorAll('div.drawers-container ul[data-automation="drawer-body"]>li').forEach(variant => {
        let hasAtt=variant.querySelector('button').hasAttribute('disabled');
        if(hasAtt==true){
          
        }else{
          const skuId = variant.querySelector('img')?variant.querySelector('img').src.split('_Colour_').pop().split('_sw_')[0]:'';
          const skudiv = addHiddenDiv('sku_id', skuId);
          let skuURL = variant.querySelector('button')?variant.querySelector('button').getAttribute('data-automation'):'';
          const skuUrl = addHiddenDiv('sku_url', `${url}?color=${skuURL}`);
          const innerDiv = addHiddenDiv('variants_ul', '');
          innerDiv.appendChild(skudiv);
          innerDiv.appendChild(skuUrl);
          outerDiv.appendChild(innerDiv);
        }
      });
    } else {
      const sku = document.querySelector('p[data-automation="product-part-number"] span');
      const skuId = sku ? sku.innerText : '';
      const skudiv = addHiddenDiv('sku_id', skuId);
      let skuUrl = addHiddenDiv('sku_url', url);
      const innerDiv = addHiddenDiv('variants_ul', '');
      innerDiv.appendChild(skudiv);
      innerDiv.appendChild(skuUrl);
      outerDiv.appendChild(innerDiv);
    }
    document.body.appendChild(outerDiv);
  });

  return await context.extract(variants, { transform });
  
}


module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform:null,
    domain: 'myer.com.au',
    zipcode: "''",
  },
  implementation
};
