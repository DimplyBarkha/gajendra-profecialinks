
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      // Hack: Escaping new lines in the text
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.directions = [
          {
            text: text,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
