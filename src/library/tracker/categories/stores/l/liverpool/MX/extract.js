async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });
  const json = JSON.parse(jsonText);
  await context.evaluate(async (json) => {
    console.log(json);
  }, json);
  if (json && json.l1Categories && json.l1Categories.length >= 0) {
    await context.evaluate(async (records) => {
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
      document.body.innerText = '';
      records.forEach(record => {
        record.l2subcategories.forEach(l2subcategory => {
          l2subcategory.l3subcategories.forEach(l3subcategory => {
            const subWrapper = addHiddenDiv('cat-wrapper');
            addHiddenDiv('cat', record.name, subWrapper);
            addHiddenDiv('cat', l2subcategory.name, subWrapper);
            addHiddenDiv('cat', l3subcategory.name, subWrapper);
            addHiddenDiv('cat-url', l3subcategory.url, subWrapper);
          });
        });
      });
    }, json.l1Categories);
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'MX',
    domain: 'liverpool.com.mx',
    store: 'liverpool',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
