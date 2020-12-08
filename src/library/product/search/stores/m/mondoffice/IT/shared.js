/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const searchTerms = [];
  const urlCustom = [];
  data.forEach(element => {
    searchTerms.push(element.group.find(e => e.input) ? element.group.find(e => e.input) : []);
    urlCustom.push(element.group.find(e => e.url) ? element.group.find(e => e.url) : []);
  });
  const filterSearch = searchTerms.length ? searchTerms.filter(e => e)[0].input : [];
  const url = urlCustom.length ? urlCustom.filter(e => e)[0].url : [];
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['_input'] = filterSearch.length ? filterSearch : [];
        gr['_url'] = url.length ? url : [];
        gr['rankOrganic'] = gr.length ? [{ text: index + 1 }] : [{ text: 1 }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data.length ? data : [];
};
module.exports = { transform };
