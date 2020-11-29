async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const aggregateRating = document.querySelectorAll('.rating');
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);
    }
    const itemContainers = document.querySelectorAll('#lb-results > div > div > ul > li');
    let rank = 1;
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
    // function addElementToDocument (key, value) {
    //   const catElement = document.createElement('div');
    //   catElement.id = key;
    //   catElement.textContent = value;
    //   catElement.style.display = 'none';
    //   document.body.appendChild(catElement);
    // }
    // const arr = document.querySelectorAll('#lb-results > div > div');
    // console.log(arr.length);
    // for (let i = 0; i < arr.length; i++) {
    // let a = arr[i].getAttribute("data-id-product");
    // console.log(a);
    // let a1 = a.concat('-')
    // let b = arr[i].getAttribute("data-id-product-attribute");
    // let mainDataObj = window.rcTagManagerLib.getInstance.productsListCache[a1.concat(b)].ean13
    // let mainDataObj = window.dataLayer[4].ecommerce.impressions[0];
    // console.log(mainDataObj);
    //   if (mainDataObj) {
    //     addElementToDocument('pd_variantId', mainDataObj.dimension2);
    //   }
    // }
  });
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    transform: null,
    domain: 'nay.sk',
    zipcode: '',
  },
  implementation,
};
