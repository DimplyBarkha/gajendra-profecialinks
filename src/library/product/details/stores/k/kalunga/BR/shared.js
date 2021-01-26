/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function cleanText (str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }

  const onlyNumbers = /[^\d,]+/g;

  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        if (gr.category) {
          gr.category.shift();
          gr.category.forEach(e => {
            e.text = cleanText(e.text);
          });
        }
        if (gr.price) gr.price[0].text = cleanText(gr.price[0].text.replace('R$', ''));
        if (gr.description) gr.description = [{ text: gr.description.map(e => cleanText(e.text)).join(' || ') }];
        if (gr.variantId) gr.variantId[0].text = gr.variantId[0].text.replace(onlyNumbers, '');
        if (gr.alternateImages) gr.alternateImages = gr.alternateImages.splice(1, gr.alternateImages.length - 1);
        if (gr.specificationsList && gr.specifications) {
          const list = gr.specificationsList.map(e => e.text).join(' || ')
            .replace('Características do Produto ||', '')
            .replace('Diferenciadores: ||', '')
            .replace('Especificações ||', '')
            .split(' || ');
          let a = [];
          list.forEach(el => {
            a.push(gr.specifications.find(item => item.text.includes(cleanText(el))));
          });
          gr.specifications = [{ text: a.map(e => cleanText(e.text)).join(' || ') }];
        }
        if (gr.descriptionBullets) gr.descriptionBullets = [{ text: gr.descriptionBullets.length }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
