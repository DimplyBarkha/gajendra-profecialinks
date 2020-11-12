
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRatingText) {
        row.aggregateRating = [
          {
            text: row.aggregateRatingText[0].text.replace(/ \D.*/, ''),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
