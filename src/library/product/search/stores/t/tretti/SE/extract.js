async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    const itemContainers = document.querySelectorAll('#content > div.srp > div.srp-body > div.srp-product-wrap > div.srp-product-wrap__product-list.list > div > div > div.srp-product-box__content-wrapper');
    let rank = 1;
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'tretti',
    transform: null,
    domain: 'tretti.se',
    zipcode: '',
  },
  implementation,
};
