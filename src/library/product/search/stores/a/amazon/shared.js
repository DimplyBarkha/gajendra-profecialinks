
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }

    const searchUrl = window.location.href;
    const productList = document.querySelectorAll('.a-section.a-spacing-medium');

    productList && productList.forEach((item1) => {
      const doc = item1;
      addElementToDocument(doc, 'searchUrl', searchUrl);
    });
  });
  return await context.extract(productDetails, { transform: parameters.transform });
};
