
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      if (!content) content = '';
      newDiv.textContent = content;
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    let categoriesArr = [];
    try {
      // @ts-ignore
      categoriesArr = [...document.querySelectorAll('label[for*="category-checkbox"] > span[data-category]')].map(el => {
        const obj = {};
        const categoryName = el.getAttribute('data-label');
        const categoryId = el.getAttribute('data-value');
        obj.url = 'https://www.insight.com/en_US/search.html?qtype=all&pq=' +
          encodeURIComponent(`{"searchTerms":{"${categoryName}":{"field":"category","value":"${categoryId}"}},"sortBy":"BestMatch"}`);
        obj.category = el.getAttribute('data-gtm-info');
        return obj;
      });
      console.log(categoriesArr);
    } catch (e) {
      console.log('Error extracting categories: ' + e);
    }
    if (!categoriesArr.length) throw new Error('Could not extract categories');

    for (let i = 0; i < categoriesArr.length; i++) {
      const newDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', categoriesArr[i].category, newDiv);
      addHiddenDiv('categoryUrl', categoriesArr[i].url, newDiv);
    }
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'insight.com',
    store: 'insight',
    zipcode: "''",
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
