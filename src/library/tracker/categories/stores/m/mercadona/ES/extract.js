
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'mercadona.es',
    store: 'mercadona',
    zipcode: '46008',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    try {
      await context.setInputValue('input[aria-label="Código postal"]', '46008');
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.click('input.postal-code-form__button');
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.click('a[href="/categories"]');
    } catch (e) {
      console.log(e);
    }
    await context.waitForSelector('.category-menu');

    await context.evaluate(async () => {
      function addHiddenDiv (className, content, node) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        node.appendChild(newDiv);
      }
      const response = await fetch('https://tienda.mercadona.es/api/categories/?lang=es&wh=vlc1')
        .then(res => res.json())
        .then(json => json.results);
      console.log(response);

      const categoriesCollection = document.querySelectorAll('.category-menu__item');

      categoriesCollection.forEach((category, index) => {
        // const mainCategory = response[index].name;
        // addHiddenDiv('helper-sub-category', mainCategory, category);
        const subCategories = response[index].categories;
        subCategories.forEach(sub => {
          const url = `https://tienda.mercadona.es/categories/${sub.id}`;

          addHiddenDiv('helper-sub-category', sub.name, category);
          addHiddenDiv('helper-sub-url', url, category);
        });
      });
    });
    return await context.extract(productMenu);
  },
};
