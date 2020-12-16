module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'IT',
    domain: 'mediaworld.it',
    store: 'mediaworld',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapDivPresent = await context.evaluate(async () => {
      return document.querySelector('div.content-map-site') !== null;
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
        const mainCategoryContainers = document.querySelectorAll('div.content-map-site div.item-4');
        mainCategoryContainers.forEach(mainCategory => {
          const categoryContainers = mainCategory.querySelectorAll('div.title ~ ul > li');
          categoryContainers.forEach(category => {
            const subCategories = category.querySelectorAll('a ~ ul > li > a');
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach(subCategory => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv('cat', mainCategory.querySelector('div.title a') ? mainCategory.querySelector('div.title a').textContent : '', subWrapper);
                addHiddenDiv('cat', category.querySelector('a') ? category.querySelector('a').textContent : '', subWrapper);
                addHiddenDiv('cat', subCategory.textContent, subWrapper);
                addHiddenDiv('cat-url', subCategory.getAttribute('href'), subWrapper);
                console.log(subCategory.textContent);
              });
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
