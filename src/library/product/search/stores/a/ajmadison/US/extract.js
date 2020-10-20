//const { cleanUp } = require('@library/product/details/shared');
const { cleanUp } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'US',
store: 'ajmadison',
transform: cleanUp,
domain: 'ajmadison.com',
zipcode: '',
},
implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
await context.evaluate(async function () {
// Java Script Code for adding new Div
function addHiddenDiv (id, content) {
const newDiv = document.createElement('div');
newDiv.className = id;
newDiv.textContent = content;
newDiv.style.display = 'none';
document.body.appendChild(newDiv);
}
// Java Script Code to retrive Xpath for URL
var xpath = function (xpathToExecute) {
var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
addHiddenDiv('ajmadison_url', 'https://www.ajmadison.com' + nodesSnapshot.snapshotItem(i).textContent);
}
};
// Java Script Code to retrive Xpath for Aggregate Rating
var xpathAggregateRating = function (xpathToExecute) {
var data = '';
var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
data = nodesSnapshot.snapshotItem(i).textContent;
data = data.substring(data.indexOf('ratingValue":') + 13);
data = data.substring(0, data.indexOf('}'));
if (/^\d+\.\d+$/.test(data)) {
addHiddenDiv('ajmadison_Agg_Rating', data);
}
}
};
xpath('//a[@class="hover-text-decoration-none "]/@href');
xpathAggregateRating('//div[@class="col col-9 lg-col-7 px-2"]//script/text()');
});
return await context.extract(productDetails);
},
};