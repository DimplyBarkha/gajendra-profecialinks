const {transform}=require('../UA/variantsFormat');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv(className, content) {
      const newDiv = document.createElement('div');
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      return newDiv;
    }
    let url = window.location.href;
    const outerDiv = addHiddenDiv('variants_outer', '');
    if (document.querySelector('ul.var-options__list>li>a')) {
      document.querySelectorAll('ul.var-options__list>li>a').forEach(variant => {
        let skuId;
        if(variant.href.charAt(variant.href.length-1)=='/'){
          skuId=variant.href.slice(0, -1).split('/').pop().replace('p','').replace('g','');
        }else{
          skuId=variant.href.split('/').pop().replace('p','').replace('g','');
        }
        let tmp=skuId.sub
        const skudiv = addHiddenDiv('sku_id', skuId);
        const skuUrl = addHiddenDiv('sku_url', variant.href);
        const innerDiv = addHiddenDiv('variants_ul', '');
        innerDiv.appendChild(skudiv);
        innerDiv.appendChild(skuUrl);
        outerDiv.appendChild(innerDiv);
      });
    } else {
      //const sku = document.querySelector('div.ProductMainSection__itemNumber');
      let skuId;
      if(url.charAt(url.length-1)=='/'){
        skuId = url.slice(0, -1).split('/').pop().replace('p','').replace('g','');
      }else{  
        skuId = url.split('/').pop().replace('p','').replace('g','');
      }
      const skudiv = addHiddenDiv('sku_id', skuId);
      const skuUrl = addHiddenDiv('sku_url', url);
      const innerDiv = addHiddenDiv('variants_ul', '');
      innerDiv.appendChild(skudiv);
      innerDiv.appendChild(skuUrl);
      outerDiv.appendChild(innerDiv);
    }
    document.body.appendChild(outerDiv);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UA',
    store: 'rozetka',
    transform,
    domain: 'rozetka.com.ua',
    zipcode: '',
  },
  implementation,
};
