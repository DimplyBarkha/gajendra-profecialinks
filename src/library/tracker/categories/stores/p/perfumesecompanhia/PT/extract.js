
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

    function getNodes () {
      // @ts-ignore
      return [...document.querySelectorAll('ul[class="menu-geral nav"] > li[class*="first-level m"]')].map(el => {
        let result = [];
        const parentCategory = el.innerText;
        el.querySelectorAll('div[class="menu-cell"]').forEach(childEl => {
          let parentSubcategory = '';
          const subcategories = [...childEl.querySelectorAll('a')].map((lastEl, index) => {
            const obj = {};
            if (index === 0) parentSubcategory = lastEl.innerText;
            if (parentSubcategory && index > 0) obj.categoryName = `${parentCategory}|${parentSubcategory}|${lastEl.innerText}`;
            else obj.categoryName = `${parentCategory}|${lastEl.innerText}`;
            obj.url = lastEl.getAttribute('href');
            return obj;
          });
          result.push(subcategories);
          result = result.flat();
        });
        return result;
      }).flat();
    }

    let categoriesArr = [];

    try {
      categoriesArr = getNodes();
    } catch (e) {
      console.log('Error extracting categories: ' + e);
    }

    if (!categoriesArr.length) throw new Error('Could not extract categories');

    for (let i = 0; i < categoriesArr.length; i++) {
      const newDiv = addHiddenDiv('categories', '');
      const splitCategories = categoriesArr[i].categoryName.split('|');
      if (splitCategories.length) {
        splitCategories.forEach((val) => {
          addHiddenDiv('category', val, newDiv);
        });
      }
      addHiddenDiv('categoryUrl', categoriesArr[i].url, newDiv);
    }
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PT',
    domain: 'perfumesecompanhia.pt',
    store: 'perfumesecompanhia',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
