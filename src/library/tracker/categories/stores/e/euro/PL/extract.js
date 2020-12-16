async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    // categories
    const mainCategories = document.querySelectorAll('li>ul>li div[class="node-lists"] li');
    mainCategories.forEach((categoryNode) => {
      if (categoryNode.querySelector('a') && categoryNode.className !== 'main-category') {
        const category = categoryNode.querySelector('a');
        if (category.textContent !== 'Więcej ...') {
          const newCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newCatDiv);
          addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
        }
      }
    });
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'PL',
    domain: 'euro.com.pl',
    store: 'euro',
    zipcode: '',
  },
  implementation,
};
