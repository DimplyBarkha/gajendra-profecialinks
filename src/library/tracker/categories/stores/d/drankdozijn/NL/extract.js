module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NL',
    domain: 'drankdozijn.nl',
    store: 'drankdozijn',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapDivPresent = await context.evaluate(async () => {
      return document.querySelector('li.has-dropdown') !== null;
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

        const mainCategoryContainers = document.querySelectorAll('li[class="has-dropdown"]');
        mainCategoryContainers.forEach(mainCategory => {
          const categoryContainers = mainCategory.querySelectorAll('div.dropdown > div.w_max > ul:first-child > li a');
          categoryContainers.forEach(category => {
            if (category) {
              const subWrapper = addHiddenDiv('cat-wrapper');
              addHiddenDiv('cat', mainCategory.querySelector('a span') ? mainCategory.querySelector('a span').textContent : '', subWrapper);
              addHiddenDiv('cat', category.textContent, subWrapper);
              addHiddenDiv('cat-url', category.getAttribute('href'), subWrapper);
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
