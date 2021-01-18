
const { Context } = require('mocha');
const { transform } = require('../shared');

async function implementation (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;
await new Promise((resolve, reject) => setTimeout(resolve, 20000));
var variantLength = await context.evaluate(async () => {
return (document.querySelectorAll('div.swatch-attribute-options div.swatch-option')) ? document.querySelectorAll('div.swatch-attribute-options div.swatch-option').length : 0;
});
console.log('variantLength:: ', variantLength);
if (variantLength > 1) {
for (let j = 0; j < variantLength; j++) {
try {
try {
await context.evaluate(async (j) => {
function addHiddenDiv (id, content) {
//var removeId = document.getElementById('pd_vairiant_id');
//removeId && removeId.remove();
console.log("content",content);
const newDiv = document.createElement('div');
newDiv.id = id;
newDiv.textContent = content;
newDiv.style.display = 'none';
document.body.appendChild(newDiv);
}
// @ts-ignore
const variantDoc = document.querySelectorAll('div.swatch-attribute-options div.swatch-option')[j];
// @ts-ignore
variantDoc && variantDoc.click();
await new Promise((resolve, reject) => setTimeout(resolve, 1000));

//var removeId = document.getElementById('pd_vairiant_id');
//removeId && removeId.remove();
// @ts-ignore
var listPrice=document.querySelectorAll('div.custom-option-price')[j].innerText;
var repListPrice=listPrice.replace(/\s+€/g,"");
var modifiedListPrice=repListPrice.replace(/[,]/g,".");
// @ts-ignore
const obj = AEC.CONFIGURABLE_SIMPLES;
// @ts-ignore
for(let i=0;i<Object.keys(obj).length;i++){
  var objKeys=Object.keys(obj)[i];
  var objPrice=obj[objKeys].price;
  console.log('objPrice',parseFloat(objPrice),'modifiedListPrice',modifiedListPrice);
  if(modifiedListPrice==parseFloat(objPrice)){
var variantID = obj[objKeys].id;
console.log("variantID",variantID);
addHiddenDiv('pd_vairiant_id', variantID);
}}
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
