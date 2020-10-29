
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(e => {
    if (e.images) e.images.push(e.thumbs);
  });
  return data;
};

module.exports = { transform };
