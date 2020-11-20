
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        const mainData = JSON.parse(gr.brand.map(e => e.text)[1]);
        gr.sub_category.shift();
        if (mainData) {
          gr.brand = [{ text: mainData.brand }];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
