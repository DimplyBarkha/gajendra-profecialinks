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
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    const itemContainers = document.querySelectorAll('._blocks-replaced');
    let rank = 1;
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }

    const aggregateRating = document.querySelectorAll('div.rating-box__active-wrap');
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
    }

    const readButton = document.getElementsByTagName('a');
    console.log(readButton);

    // @ts-ignore
    for (const itemContainer of readButton) {
      console.log(itemContainer);
      console.log(itemContainer.getAttribute('data-tab-name') === 'video');
      if (itemContainer && itemContainer.getAttribute('data-tab-name') === 'video') {
        itemContainer.click();
        console.log('itemContainer');
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    transform: null,
    domain: 'comfy.ua',
    zipcode: '',
  },
  implementation,
};
