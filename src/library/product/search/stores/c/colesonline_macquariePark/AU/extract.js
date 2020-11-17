// const { transform } = require('../../../../shared');
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_macquariePark',
    transform,
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
  ) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
  function addHiddenDiv (id, content) {
  const newDiv = document.createElement('div');
  newDiv.id = id;
  newDiv.textContent = content;
  newDiv.style.display = 'none';
  document.body.appendChild(newDiv);
  }
  function addChildDiv (id, content, index) {
  const newDiv = document.createElement('div');
  newDiv.id = id;
  newDiv.textContent = content;
  newDiv.style.display = 'none';
  const originalDiv = document.querySelectorAll("section[id*='product-list'] div[tile='tile'] span[class*='product-brand']")[index];
  originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  const product = document.querySelectorAll("section[id*='product-list'] div[tile='tile']");
  product.forEach((item, index) => {
  // @ts-ignore
  const brand = item.querySelector("span[class*='product-brand']") ? item.querySelector("span[class*='product-brand']").innerText : '';
  // @ts-ignore
  const name = item.querySelector("span[class*='product-name']") ? item.querySelector("span[class*='product-name']").innerText : '';
  if (brand && name) {
  addChildDiv('ii_name', brand.trim() + ' ' + name.trim(), index);
  } else {
  addChildDiv('ii_name', name.trim(), index);
  }
  });
  const searchUrl = window.location.href;
  addHiddenDiv('ii_searchUrl', searchUrl);
  });
  return await context.extract(productDetails, { transform });
  }
