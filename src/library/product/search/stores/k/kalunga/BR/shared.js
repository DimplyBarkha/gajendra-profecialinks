/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const searchTerms = [];
  const urlCustom = [];
  data.forEach(element => {
    searchTerms.push(element.group.find(e => e.input));
    urlCustom.push(element.group.find(e => e.url_custom));
  });
  const filterSearch = searchTerms.filter(e => e)[0].input;
  const url = urlCustom.filter(e => e)[0].url_custom;
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr.productUrl[0].text = 'https://www.kalunga.com.br' + gr.productUrl[0].text;
        if (gr.id) {
          const text = gr.id[0].text;
          gr.id[0].text = gr.id[0].text = text.substring(text.length - 6);
          gr.gtin[0].text = gr.gtin[0].text = text.substring(text.length - 6);
          gr['_input'] = filterSearch;
          gr['_url'] = url;
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
