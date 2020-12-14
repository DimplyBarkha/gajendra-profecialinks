
const { transform } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'US',
store: 'ajmadison',
transform: transform,
domain: 'ajmadison.com',
zipcode: '',
},
implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
await context.evaluate(async function () {
// Java Script Code for adding new Div
function addHiddenDiv(id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv = document.querySelectorAll('div[class="block mr2 bold f13 font-size-md"]')[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
// Java Script Code to retrive Xpath for URL
const getXpath = (xpath, prop) => {
    const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    let result;
    if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    else result = elem ? elem.singleNodeValue : '';
    return result && result.trim ? result.trim() : result;
  };
  var length1=document.querySelectorAll('div[class="block mr2 bold f13 font-size-md"]').length;
  for(let i=0;i<length1;i++)
  {
      var rank=i+1
      addHiddenDiv('rank',rank,i);
      }
    var length=document.querySelectorAll('div[class="col col-9 lg-col-7 px-2"] script').length
for (let i=0;i<length;i++)
{
// @ts-ignore
var abc=document.querySelectorAll('div[class="col col-9 lg-col-7 px-2"] script')[i].innerText;
var obj = JSON.parse(abc);
try{
var cde=obj[1].aggregateRating;
var rating=cde.ratingValue;
}
catch(e)
{

}

addHiddenDiv('rating1',rating,i);
}

try {
  document.getElementById('pd_url').remove();
} catch (error) {
}
});
return await context.extract(productDetails);
},
};