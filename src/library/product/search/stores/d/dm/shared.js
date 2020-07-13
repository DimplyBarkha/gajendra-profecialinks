
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text = row.name.map(elm => elm.text.replace(new RegExp('(.+,\\s)(.+)', 'g'), '$2')).join(' ');
        });
        row.name = [
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
