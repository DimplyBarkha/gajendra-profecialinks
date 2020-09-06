/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        var count = 0;
        row.name.map((item) => {
          return count++;
        });
      }
    }
  }

  return data;
};

module.exports = { transform };
