
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'feelunique.com',
    store: 'feelunique',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapDivPresent = await context.evaluate(async () => {
      return document.querySelector('div#brand-list') !== null;
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

        const mainCategoryContainers = document.querySelectorAll('div#brand-list div.brand-list-container');
        mainCategoryContainers.forEach(mainCategory => {
          const categoryContainers = mainCategory.querySelectorAll('h3 + ul > li');
          categoryContainers.forEach(category => {
            const subCategories = category.querySelectorAll('li > ul > li > a');
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach(subCategory => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv('cat', mainCategory.querySelector('h3 a') ? mainCategory.querySelector('h3 a').textContent : '', subWrapper);
                addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', subWrapper);
                addHiddenDiv('cat', subCategory.textContent, subWrapper);
                addHiddenDiv('cat-url', subCategory.getAttribute('href'), subWrapper);
              });
            } else {
              const wrapper = addHiddenDiv('cat-wrapper');
              addHiddenDiv('cat', mainCategory.querySelector('h3 a') ? mainCategory.querySelector('h3 a').textContent : '', wrapper);
              addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', wrapper);
              addHiddenDiv('cat-url', category.querySelector('a') ? category.querySelector('a').getAttribute('href') : '', wrapper);
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
