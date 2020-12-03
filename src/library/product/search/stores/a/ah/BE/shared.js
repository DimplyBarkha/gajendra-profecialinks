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
    urlCustom.push(element.group.find(e => e.url));
  });
  const filterSearch = searchTerms.filter(e => e)[0].input;
  const url = urlCustom.filter(e => e)[0].url;
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      gr['rankOrganic'] = [{ text: index + 1 }];
      gr['_input'] = url;
      gr['_url'] = filterSearch;
      if (gr && gr.productUrl && gr.productUrl.length) {
        gr.productUrl[0].text = 'https://www.ah.be' + gr.productUrl[0].text;
        gr['id'] = [{ text: 'wi' + gr.productUrl[0].text.match(/\d+/g).join() }];
      }
    });
  });
  return data;
};

module.exports = { transform };
