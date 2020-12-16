
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DK',
    domain: 'lomax.dk',
    store: 'lomax',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapDivPresent = await context.evaluate(async () => {
      return document.querySelector('nav#megamenu') !== null;
    });

    if (isSiteMapDivPresent) {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content, parentDiv = null) {
          const newDiv = document.createElement('div');
          newDiv.dataset.id = id;
          if (!content) content = '';
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }
        const mainCategoryContainers = document.querySelectorAll('ul#megamenuroot li');
        mainCategoryContainers.forEach(mainCategory => {
          const categoryContainers = mainCategory.querySelectorAll('div.dropdown-menu > div[class="dropdown dropdown-submenu"]');
          categoryContainers.forEach(category => {
            const subCategories = category.querySelectorAll('div.dropdown-menu button ~ a');
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach(subCategory => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv('cat', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', subWrapper);
                addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', subWrapper);
                addHiddenDiv('cat', subCategory.textContent, subWrapper);
                addHiddenDiv('cat-url', subCategory.getAttribute('href'), subWrapper);
                console.log(subCategory.textContent);
              });
            } else if (category.querySelector('a')) {
            /* categories from the second level of nesting lead to a page without products
              const wrapper = addHiddenDiv('cat-wrapper');
              addHiddenDiv('cat', mainCategory.querySelector('div.title a') ? mainCategory.querySelector('div.title a').textContent : '', wrapper);
              addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', wrapper);
              addHiddenDiv('cat-url', category.querySelector('a') ? category.querySelector('a').getAttribute('href') : '', wrapper); */
            }
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
