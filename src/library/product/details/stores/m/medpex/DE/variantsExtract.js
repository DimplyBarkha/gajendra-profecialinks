
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform: null,
    domain: 'medpex.de',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    const mainurl = window.location.href;
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    addElementToDocument('mainurl', mainurl);
    const varinantURLs = document.querySelectorAll('div[class="content"] table tbody td b a');
    for (let i = 0; i < varinantURLs.length; i++) {
      addElementToDocument('mainurl', 'https://www.medpex.de' + varinantURLs[i].getAttribute('href'));
    }
  });
  return await context.extract(variants, { transform });
}