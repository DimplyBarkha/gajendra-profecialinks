const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
  country: 'NO',
  store: 'Kicks',
  transform,
  domain: 'kicks.no',
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
  //for rank
  function addHiddenDiv(id, content, index) {
  const newDiv = document.createElement('div');
  newDiv.id = id;
  newDiv.textContent = content;
  newDiv.style.display = 'none';
  const originalDiv = document.querySelectorAll('span[class="ed dt"]')[index];
  originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  // let rankOrganic;
  // let url = window.location.href;
  // let checkPageNumber = url.split('&')[1];
  // try {
  // if (checkPageNumber.startsWith('pageNumber=')) {
  // rankOrganic = checkPageNumber.replace('pageNumber=', '');
  // }
  // }
  // catch (err) {
  // }
  // var dup = Number(rankOrganic);
  // dup = dup - 1;
  // if (!rankOrganic) {
  // rankOrganic = 1;
  // } else {
  // rankOrganic = (dup * 60) + 1;
  // }
  // const urlProduct = document.querySelectorAll('a[class="pt__link"]');
  // for (let i = 0; i < urlProduct.length; i++) {
  // addHiddenDiv('rankOrganic', rankOrganic++, i);
  // }
  let firstChildNode;
  const aggregateRating = document.querySelectorAll("span[class='ed dt']")
  for (let k = 0; k < aggregateRating.length; k++) {
  firstChildNode = aggregateRating[k].getElementsByClassName('ee ef').length
  addHiddenDiv('aggregateRating', firstChildNode, k);
  }
  });
  //rank end
  return await context.extract(productDetails, { transform });
  }