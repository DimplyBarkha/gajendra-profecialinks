
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    transform: null,
    domain: 'monclick.it',
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
function addHiddenDiv(id, content, index) {
const newDiv = document.createElement('div');
newDiv.id = id;
newDiv.textContent = content;
newDiv.style.display = 'none';
const originalDiv = document.querySelectorAll('p[class="mk-listingProductOpinions"]')[index];
originalDiv.parentNode.insertBefore(newDiv, originalDiv);
}
const aggregateRating = document.querySelectorAll('p[class="mk-listingProductOpinions"]')
for (let k = 0; k < aggregateRating.length; k++) {
var e = aggregateRating[k].getElementsByClassName('mk-icon mk-icon-large')
var count = 0;
var value = 0;
var aggregateRating1 = 0;
for(var i = 0; i < e.length; i++) {
  if(e[i].className == 'mk-icon mk-icon-star mk-icon-large') {
      count = count + 1
  }
  if(e[i].className == 'mk-icon mk-icon-half-star mk-icon-large'){
    value = 0.5
  }
}
if(value > 0){
  aggregateRating1=count+value
}
else{
  aggregateRating1 = count
}
addHiddenDiv('aggregateRating', aggregateRating1, k);
}
});
//rank end
return await context.extract(productDetails, { transform });
}