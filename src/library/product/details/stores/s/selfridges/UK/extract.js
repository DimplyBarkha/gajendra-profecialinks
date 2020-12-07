const { transform } = require('./format');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    function addElementToDocument(id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    // const isAvailable = document.querySelector('section.c-filter button[data-action="add-to-bag"]')
    //   ? document.querySelector('section.c-filter button[data-action="add-to-bag"]') : null;
    // // @ts-ignore
    // if (isAvailable !== null && isAvailable.innerText === 'Add to bag') {
    //   addElementToDocument('isAvailable', 'In Stock', 'Yes');
    // } else if (document.querySelector('div.sorrymessage')) {
    //   addElementToDocument('isAvailable', 'Out of Stock', 'No');
    // } else {
    //   addElementToDocument('isAvailable', '', 'No');
    // }


    const isImgZoom = document.querySelector('span.hero-zoom')
      ? document.querySelector('span.hero-zoom') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }

    const description1 = document.querySelector('#content1 div.c-tabs__copy span')
      ? document.querySelector('#content1 div.c-tabs__copy span').innerText : '';
    const description2 = document.querySelectorAll('#content1 div.c-tabs__copy ul li')
      ? document.querySelectorAll('#content1 div.c-tabs__copy ul li') : '';
    if (description2) {
      const bulletsArr = [description2];
      const bulletsArrSliced = bulletsArr.slice(1);
      // @ts-ignore
      description2.forEach(e => bulletsArrSliced.push(e.textContent));
      const concatDesc = bulletsArrSliced.join(' || ');
      addElementToDocument('descriptionBull', concatDesc);
    } else if (description1) {
      addElementToDocument('description', description1);
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: transform,
    domain: 'selfridges.com',
    zipcode: '',
  }, implementation,
};
