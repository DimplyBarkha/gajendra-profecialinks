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
      try {
        gr['_input'] = filterSearch;
        gr['_url'] = url;
        gr['rankOrganic'] = [{ text: index + 1 }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
