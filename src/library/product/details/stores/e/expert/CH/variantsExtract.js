async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    await new Promise(resolve => setTimeout(resolve, 2000));
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    function findXpathArr (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      let node = element.iterateNext();
      const value = [];
      while (node) {
        value.push(node.textContent);
        node = element.iterateNext();
      }
      return value;
    }
    const variantsLink = [];
    const variantsId = [];
    let url = window.location.href;
    let id = url ? url.replace(/.*\/de\/s1\/product\/.*-(\d+).*/, '$1') : '';
    variantsLink.push(url);
    variantsId.push(id);
    addHiddenDiv('ii_variant', url);
    addHiddenDiv('ii_variantId', id);
    findXpathArr("//div[contains(@id,'Farbvariante')]//a[contains(@class,'styled')]/@href | //div[contains(@class,'variants')]//a[contains(@class,'styled')]/@href").forEach(item => {
      id = item ? item.replace(/.*\/de\/s1\/product\/.*-(\d+).*/, '$1') : '';
      url = item ? 'https://www.digitec.ch' + item : '';
      variantsId.indexOf(id) === -1 && variantsId.push(id) && addHiddenDiv('ii_variantId', id);
      variantsLink.indexOf(url) === -1 && variantsLink.push(url) && url && addHiddenDiv('ii_variant', url);
    });
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    transform: null,
    domain: 'digitec.ch',
    zipcode: '',
  },
  implementation,
};
