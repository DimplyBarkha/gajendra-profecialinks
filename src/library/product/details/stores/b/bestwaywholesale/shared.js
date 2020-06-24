
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
      // Escaping comma if present as last character
      if (row.manufacturer) {
        let text = '';
        row.manufacturer.forEach(item => {
          if (item.text.substring(item.text.length - 1, item.text.length) === ',') {
            text += item.text.substring(0, item.text.length - 1)
          } else {
            text += item.text;
          }
        });
        row.manufacturer = [
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
