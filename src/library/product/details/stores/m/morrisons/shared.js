
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
        row.directions = [
          {
            text: text,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ').replace(new RegExp('(.+)(Warning:)(.+)(Usage:)(.+)', 'g'), '$3');
        });
        row.warnings = [
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
