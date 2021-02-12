module.exports = {
implements: 'product/details/variants/variantsExtract',
parameterValues: {
country: 'DE',
store: 'otto-office',
transform: null,
domain: 'otto-office.com',
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
const { variants } = dependencies;
await context.evaluate(async function () {
function addElementToDocument(key, value) {
const catElement = document.createElement('div');
catElement.id = key;
catElement.textContent = value;
catElement.style.display = 'none';
document.body.appendChild(catElement);
}
// Method to Retrieve Xpath content of a Multiple Nodes
const getAllXpath = (xpath, prop) => {
const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
const result = [];
for (let index = 0; index < nodeSet.snapshotLength; index++) {
const element = nodeSet.snapshotItem(index);
if (element) result.push(prop ? element[prop] : element.nodeValue);
}
return result;
};
// @ts-ignore
let URL = window.location.href;
addElementToDocument('URL', URL);
// @ts-ignore
var subURLS = getAllXpath('//div[contains(@class,"boxProductSimilar")]//div[@class="h3"]//a/@href', 'nodeValue');
for (let i = 0; i < subURLS.length; i++) {
addElementToDocument('URL',subURLS[i]);
}
});
return await context.extract(variants, { transform });
}