
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'alcampo.es',
    store: 'alcampo',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('div#mobile-nav') !== null;
    });

    if (isSiteMapPresent) {
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

        const mainCategoryContainers = document.querySelectorAll(
          'div#mobile-nav ul.menuMobile > li[data-submenu-id*="Nav"]',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          const mainCategoryId = mainCategory.getAttribute('data-submenu-id');
          const categoryContainers = mainCategory.querySelectorAll(
            `li[data-submenu-id=${mainCategoryId}] > ul > li[data-submenu-id]`,
          );
          categoryContainers.forEach((category) => {
            const categoryId = category.getAttribute('data-submenu-id');
            const subCategoryContainers = category.querySelectorAll(
              `li[data-submenu-id=${categoryId}] > ul > li[data-submenu-id]`,
            );
            if (subCategoryContainers && subCategoryContainers.length > 0) {
              subCategoryContainers.forEach((subCategory) => {
                const deepestSubCategories = subCategory.querySelectorAll(
                  'ul > li[data-submenu-id]',
                );
                if (deepestSubCategories && deepestSubCategories.length > 0) {
                  deepestSubCategories.forEach(deepestSubCategory => {
                    const deepestWrapper = addHiddenDiv('cat-wrapper');
                    addHiddenDiv(
                      'cat',
                      mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span')
                        ? mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span').textContent
                        : '',
                      deepestWrapper,
                    );
                    addHiddenDiv(
                      'cat',
                      category.querySelector('div')
                        ? category.querySelector('div').textContent
                        : '',
                      deepestWrapper,
                    );
                    addHiddenDiv(
                      'cat',
                      subCategory.querySelector('div')
                        ? subCategory.querySelector('div').textContent
                        : '',
                      deepestWrapper,
                    );
                    addHiddenDiv(
                      'cat',
                      deepestSubCategory.querySelector('div')
                        ? deepestSubCategory.querySelector('div').textContent
                        : '',
                      deepestWrapper,
                    );
                    addHiddenDiv(
                      'cat-url',
                      deepestSubCategory.getAttribute('data-submenu-href'),
                      deepestWrapper,
                    );
                  });
                } else {
                  const subWrapper = addHiddenDiv('cat-wrapper');
                  addHiddenDiv(
                    'cat',
                    mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span')
                      ? mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span').textContent
                      : '',
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat',
                    category.querySelector('div')
                      ? category.querySelector('div').textContent
                      : '',
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat',
                    subCategory.querySelector('div')
                      ? subCategory.querySelector('div').textContent
                      : '',
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat-url',
                    subCategory.getAttribute('data-submenu-href'),
                    subWrapper,
                  );
                }
              });
            } else {
              const wrapper = addHiddenDiv('cat-wrapper');
              addHiddenDiv(
                'cat',
                mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span')
                  ? mainCategory.querySelector('li[data-submenu-id*="Nav"] > div > div.data-submenu-texto > span').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat',
                category.querySelector('div')
                  ? category.querySelector('div').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat-url',
                category.getAttribute('data-submenu-href'),
                wrapper,
              );
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
