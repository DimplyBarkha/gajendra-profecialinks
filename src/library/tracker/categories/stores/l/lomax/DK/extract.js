
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
    // hovering on page makes modal appearing
    await context.hover('body');
    // only of modal appears DOM is completely loaded
    await context.waitForSelector('body.modal-open');

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
          if (mainCategory.querySelector('div.dropdown-menu')) {
            const categoryContainers = mainCategory.querySelectorAll('div[class="dropdown dropdown-submenu"]');
            categoryContainers.forEach(category => {
              const subCategories = category.querySelectorAll('div.dropdown-menu button ~ a ~ a');
              if (subCategories && subCategories.length > 0) {
                subCategories.forEach(subCategory => {
                  const subWrapper = addHiddenDiv('cat-wrapper');
                  addHiddenDiv('cat', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', subWrapper);
                  addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', subWrapper);
                  addHiddenDiv('cat', subCategory.textContent, subWrapper);
                  addHiddenDiv('cat-url', subCategory.getAttribute('href'), subWrapper);
                });
              } else if (category.querySelector('a')) {
                const wrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv('cat', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', wrapper);
                addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', wrapper);
                addHiddenDiv('cat-url', category.querySelector('a') ? category.querySelector('a').getAttribute('href') : '', wrapper);
              }
            });
          } else {
            const subWrapper = addHiddenDiv('cat-wrapper');
            addHiddenDiv('cat', mainCategory.querySelector('a') ? mainCategory.querySelector('a').textContent : '', subWrapper);
            addHiddenDiv('cat-url', mainCategory.querySelector('a') ? mainCategory.querySelector('a').getAttribute('href') : '', subWrapper);
          }
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
