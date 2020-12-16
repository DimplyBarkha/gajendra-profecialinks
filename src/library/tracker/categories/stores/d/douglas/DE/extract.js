module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'douglas.de',
    store: 'douglas',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('div.rd__sitemap__category') !== null;
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
          'div.rd__sitemap__category',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          const categoryContainers = mainCategory.querySelectorAll(
            'div.rd__sitemap__category__subcategory',
          );
          categoryContainers.forEach((category) => {
            const subCategories = category.querySelectorAll(
              'div.rd__sitemap__category__subcategory__collapsible__link:not([class*=global]) a',
            );
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach((subCategory) => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv(
                  'cat',
                  mainCategory.querySelector('div.rd__sitemap__category__header h4')
                    ? mainCategory.querySelector('div.rd__sitemap__category__header h4').textContent
                    : '',
                  subWrapper,
                );
                addHiddenDiv(
                  'cat',
                  category.querySelector('div.rd__sitemap__category__subcategory__collapse-title h4')
                    ? category.querySelector('div.rd__sitemap__category__subcategory__collapse-title h4').textContent
                    : '',
                  subWrapper,
                );
                addHiddenDiv(
                  'cat',
                  subCategory.querySelector('span')
                    ? subCategory.querySelector('span').textContent
                    : '',
                  subWrapper,
                );
                addHiddenDiv(
                  'cat-url',
                  subCategory.getAttribute('href'),
                  subWrapper,
                );
              });
            } else {
              const wrapper = addHiddenDiv('cat-wrapper');
              addHiddenDiv(
                'cat',
                mainCategory.querySelector('div.rd__sitemap__category__header h4')
                  ? mainCategory.querySelector('div.rd__sitemap__category__header h4').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat',
                category.querySelector('div.rd__sitemap__category__subcategory__collapse-title h4')
                  ? category.querySelector('div.rd__sitemap__category__subcategory__collapse-title h4').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat-url',
                category.querySelector('div.rd__sitemap__category__subcategory__collapse-title a')
                  ? category.querySelector('div.rd__sitemap__category__subcategory__collapse-title a').getAttribute('href')
                  : '',
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
