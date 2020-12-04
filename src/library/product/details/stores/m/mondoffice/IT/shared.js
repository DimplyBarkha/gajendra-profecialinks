/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function removeExtraSpace (data) {
    const a = [];
    data.forEach(e => {
      e.text = e.text.replace(/\s+/g, ' ').trim();
      a.push(e);
    });
    return a;
  }
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
  }
  data.forEach(e => {
    e.group.forEach(gr => {
      try {
        gr['_url'] = gr.url;
        if (gr && gr.category && gr.category.length) gr.category.shift();
        if (gr && gr.description && gr.description.length) gr.description = removeExtraSpace(gr.description);
        if (gr && gr.price && gr.price.length) gr.price[0].text = onlyNumbersAndDot(gr.price[0].text);
        if (gr && gr.sku && gr.sku.length) {
          gr['mpc'] = [{ text: gr.sku[0].text }];
          gr.sku[0].text = onlyNumbersAndDot(gr.sku[0].text);
          gr['_input'] = [{ text: onlyNumbersAndDot(gr.sku[0].text) }];
        }
        if (gr && gr.specification && gr.specification.length) gr.specification = [{ text: gr.specification.map(e => e.text).join(' ') }];
        if (gr && gr.descriptionBullets && gr.descriptionBullets.length) gr.descriptionBullets = [{ text: gr.descriptionBullets.length }];
        if (gr && gr.secondaryImageTotal && gr.secondaryImageTotal.length) gr.secondaryImageTotal = [{ text: gr.secondaryImageTotal.length }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = {transform};
