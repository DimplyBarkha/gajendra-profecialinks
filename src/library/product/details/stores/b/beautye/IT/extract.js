
const { Context } = require('mocha');
const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  await context.evaluate(async () => {
    // @ts-ignore
    try{
    // @ts-ignore
    const brandText=(dataLayerTransport.data[0].ecommerce.detail.products[0].brand)?(dataLayerTransport.data[0].ecommerce.detail.products[0].brand):false; 
    function addHiddenSpan(id, content) {
      //var removeId = document.getElementById('pd_vairiant_id');
      //removeId && removeId.remove();
      console.log("contentId", content);
      const newDiv = document.createElement('span');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if(brandText){
    addHiddenSpan('new_brand_name', brandText);}}
    catch(e){
      console.log(e);
    }
  });
  // @ts-ignore
  
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.swatch-attribute-options div.swatch-option')) ? document.querySelectorAll('div.swatch-attribute-options div.swatch-option').length : 0;
  });
  console.log('variantLength:: ', variantLength);
  if (variantLength > 1) {
    for (var j = 0; j < variantLength; j++) {
      try {
        try {
          await context.evaluate(async (j) => {
            // @ts-ignore
            const obj = AEC.CONFIGURABLE_SIMPLES;
            // @ts-ignore
            const objForDescription=AEC.SUPER;
            // @ts-ignore
           
            
            //var removeBrandName = document.getElementById('new_brand_name');
                 // removeBrandName && removeBrandName.remove();
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            function addHiddenDiv(id, content) {
              //var removeId = document.getElementById('pd_vairiant_id');
              //removeId && removeId.remove();
              console.log("values are", content);
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.textContent = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
            var optionId=document.querySelectorAll('div.swatch-attribute-options div.swatch-option')[j].getAttribute('option-id');
            var checkVariantType = document.querySelectorAll('div.swatch-attribute-options div.swatch-option div.custom-option-label')[j]?true:false;
            if (checkVariantType) 
            {
              const variantDoc = document.querySelectorAll('div.swatch-attribute-options div.swatch-option')[j];
            
            // @ts-ignore
            variantDoc && variantDoc.click();
            //await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        
              // @ts-ignore
              var listPrice = document.querySelector('span[data-price-type="oldPrice"] ').innerText;
              var repListPrice = listPrice.replace(/\s+€/g, "");
              var modifiedListPrice = repListPrice.replace(/[,]/g, ".");
              for (let i = 0; i < objForDescription[0].options.length; i++) {
                let valueIndex=objForDescription[0].options[i].value_index;
                if(optionId==valueIndex){
                  let shadeDescription=(objForDescription[0].options[i].label)+' '+(objForDescription[0].label);
                  var removeDescriptionId = document.getElementById('pd_description_add');
                  removeDescriptionId && removeDescriptionId.remove();
                  addHiddenDiv('pd_description_add', shadeDescription);
                  
                }}
              for (let i = 0; i < Object.keys(obj).length; i++) {
                var objKeys = Object.keys(obj)[i];
                var objPrice = obj[objKeys].price;
            
                if (modifiedListPrice == parseFloat(objPrice)) {
                  var variantID = obj[objKeys].id;
                  console.log("variantIdInIF", variantID);
                  var removeId = document.getElementById('pd_vairiant_id');
                  removeId && removeId.remove();
                  addHiddenDiv('pd_vairiant_id', variantID);
                }
              }
            }
            else {
              const variantDoc = document.querySelectorAll('div.swatch-attribute-options div.swatch-option')[j];
            // @ts-ignore
            variantDoc && variantDoc.click();
            for (let i = 0; i < objForDescription[0].options.length; i++) {
              let valueIndex=objForDescription[0].options[i].value_index;
              if(optionId==valueIndex){
                console.log("value of I is ",i);
                let shadeDescription=(objForDescription[0].options[i].label)+' '+(objForDescription[0].label);
                var removeDescriptionId = document.getElementById('pd_description_add');
                removeDescriptionId && removeDescriptionId.remove();
                addHiddenDiv('pd_description_add', shadeDescription);
                
              }}
            
              var objKeys = Object.keys(obj)[j];
              var variantID = obj[objKeys].id;
              //console.log("variantIDInElse", variantID);
              var removeId = document.getElementById('pd_vairiant_id');
            removeId && removeId.remove();
              addHiddenDiv('pd_vairiant_id', variantID);
            }
            
            
            //var removeId = document.getElementById('pd_vairiant_id');
            //removeId && removeId.remove();
            // @ts-ignore
            //var listPrice=document.querySelectorAll('span[data-price-type="oldPrice"] ')[0].innerText;
            //var repListPrice=listPrice.replace(/\s+€/g,"");
            //var modifiedListPrice=repListPrice.replace(/[,]/g,".");
            // @ts-ignore
            // @ts-ignore

            //var objKeys=Object.keys(obj)[j];
            //var objPrice=obj[objKeys].price;
            //var objKeysLast=Object.keys(obj)[objLength-1]; 
            //var objLastPrice=obj[objKeysLast].price;
            //if(objPrice==objLastPrice) {
            /* var variantID = obj[objKeys].id;
         console.log("variantID",variantID);
         addHiddenDiv('pd_vairiant', variantID);*/
            //}
            /*else if(modifiedListPrice==parseFloat(objPrice)){
          var variantID = obj[objKeys].id;
          console.log("variantID",variantID);
          addHiddenDiv('pd_vairiant_id', variantID);
          }*/
          }, j);
          console.log('Inside variants', j);
        } catch (err) { }
        if (j !== variantLength - 1) {
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      } catch (err) { }
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    transform: transform,
    domain: 'beautye.it',
    zipcode: "''",
  },
  implementation,
};
