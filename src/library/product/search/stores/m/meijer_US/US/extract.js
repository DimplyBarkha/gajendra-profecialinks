const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_US',
    transform: transform,
    domain: 'meijer.com',
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
function addclass(xpathforpagination) {
var elems = document.querySelectorAll(xpathforpagination);
elems[0].classList.add('pagination');
}
function addElementToDocument(key, value) {
const catElement = document.createElement('div');
catElement.id = key;
catElement.textContent = value;
catElement.style.display = 'none';
document.body.appendChild(catElement);
}
function addHiddenDiv(id, content, index) {
const newDiv = document.createElement('div');
newDiv.id = id;
newDiv.textContent = content;
newDiv.style.display = 'none';
const originalDiv = document.querySelectorAll('div.product-item > div.tile-row.details-container > div.tile-column.details > a')[index];
originalDiv.parentNode.insertBefore(newDiv, originalDiv);
}
try{
var len=document.querySelectorAll('div.product-item > div.tile-row.details-container > div.tile-column.details > a').length
var a=document.querySelectorAll('div[class="for-tile"] span[itemprop="price"],div[class="for-tile"] div[class="display-price sale-price"]')
for(let i=0;i<len;i++)
{
// @ts-ignore
var price=a[i].innerText.split(" ")
if(price[0].charAt(0)=="$")
{
addHiddenDiv('price',price[0],i)
}
else{
var r= price[0].slice(0,0) + "$" + price[0].slice(0);
addHiddenDiv('price',r,i)
}

}
}
catch(e)
{

}
// Method to Retrieve Xpath content of a Single Node

const URL = window.location.href;
try {
document.getElementById('pd_url').remove();
} catch (error) {
}
addElementToDocument('pd_url', URL);
});
return await context.extract(productDetails, { transform });
}