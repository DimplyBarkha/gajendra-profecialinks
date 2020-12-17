/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function findField (key, arr = data) {
    const a = arr.map(el => el.group);
    let obj = [];
    a.forEach(e => {
      e.forEach(el => {
        if (el[key]) {
          obj = el[key];
        }
      });
    });
    return obj;
  }
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['_url'] = findField('url');
        gr['_input'] = findField('input');
        gr['rankOrganic'] = [{ text: index + 1 }];
        gr['rank'] = [{ text: index + 1 }];
        if (gr && gr.price) gr.price[0].text = '$' + gr.price[0].text;
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
