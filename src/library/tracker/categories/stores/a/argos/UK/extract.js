
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'argos.co.uk',
    store: 'argos',
    zipcode: '',
  },
  implementation,
};
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  const jsonText = await context.evaluate(() => {
    return document.body.innerText;
  });

  const json = JSON.parse(jsonText);
  // console.log('json: ', json);

  if (json && json.body.data && json.body.data.length >= 0) {
    await context.evaluate((records) => {
      function addHiddenDiv (id, content, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        if (!content) content = '';
        newDiv.textContent = content;
        // newDiv.style.display = 'none';
        if (parentDiv) {
          parentDiv.appendChild(newDiv);
        } else {
          document.body.appendChild(newDiv);
        }
        return newDiv;
      }
      function getCategories(data) {
        data.forEach(element => {
    //         console.log(element.title);
            if (element["columns"].length) {
                element["columns"].forEach(element1 => {
                    if (element1.length) {
                        element1.forEach(element2 => {
    //                         console.log(element.title + "/" + element2.title);
                            if (element2["links"].length) {
                                element2["links"].forEach(element3 => {
                                    console.log(element.title + "/" + element2.title + "/" + element3.title);
                                    const newDiv = addHiddenDiv('categories', '');
                                    addHiddenDiv('category', element.title, newDiv)
                                    addHiddenDiv('category', element2.title, newDiv)
                                    addHiddenDiv('category', element3.title, newDiv)
                                    addHiddenDiv('category', element3.link.replace(/\//g,'').split('c:')[1], newDiv)
                                    addHiddenDiv('categoryUrl', 'https://www.argos.co.uk'+element3.link, newDiv)
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    getCategories(records);
    }, json.body.data);
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
}
