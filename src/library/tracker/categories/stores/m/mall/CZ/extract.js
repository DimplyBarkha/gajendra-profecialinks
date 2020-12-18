
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CZ',
    domain: 'mall.cz',
    store: 'mall',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;
    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('div[class="grid--iso--4"]') !== null;
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
        const categoryElements = document.querySelector('div[class="grid--iso--4"]').querySelectorAll('h2, li');
        let main = '';
        for (let i = 0; i < categoryElements.length; i++) {
          if (categoryElements[i].id) {
            main = categoryElements[i].querySelector('a').textContent
          } else {
            const subWrapper = addHiddenDiv('cat-wrapper');
            const parent = addHiddenDiv('cat',' ', subWrapper );
            const url = 'https://www.mall.cz' + categoryElements[i].querySelector('a').getAttribute('href');
            addHiddenDiv('category', main, parent);
            addHiddenDiv('category', categoryElements[i].querySelector('a').textContent, parent);
            addHiddenDiv('cat-url', url, subWrapper);
          }
        }
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};