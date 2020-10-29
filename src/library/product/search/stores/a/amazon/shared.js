
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const searchUrl = window.location.href;

    const searchDiv = document.querySelector('#searchUrl');
    searchDiv ? searchDiv.textContent = searchUrl : addElementToDocument('searchUrl', searchUrl);
  });

  return await context.extract(productDetails, { transform: parameters.transform });
};
