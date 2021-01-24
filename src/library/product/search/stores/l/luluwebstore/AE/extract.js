// const { cleanUp } = require('../../../../shared');
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
  country: 'AE',
  store: 'luluwebstore',
  transform: transform,
  domain: 'luluhypermarket.com',
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
const { waitForSelector } = context;
await context.waitForSelector('button[class="js-cookie-notification-accept close"]');
await context.click('button[class="js-cookie-notification-accept close"]');
await new Promise((resolve, reject) => setTimeout(resolve, 10000));
await context.evaluate(async function () {
//for rank
function addHiddenDiv(id, content, index) {
const newDiv = document.createElement('div');
newDiv.id = id;
newDiv.textContent = content;
newDiv.style.display = 'none';
const originalDiv = document.querySelectorAll('div[class="plp-prod-name"]')[index];
originalDiv.parentNode.insertBefore(newDiv, originalDiv);
}
const abc= document.querySelectorAll('div[class="plp-prod-name"]')
let firstChildNode
for (let k = 0; k < abc.length;k++) {
  firstChildNode = abc[k].innerText
  addHiddenDiv('name', firstChildNode, k);
  }
})
await new Promise((resolve, reject) => setTimeout(resolve, 10000));
return await context.extract(productDetails, { transform });
}
