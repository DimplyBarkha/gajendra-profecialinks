
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
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ').replace(new RegExp('(.+)(Warning:)(.+)', 'g'), '$3');
        });
        row.warnings = [
          {
            text: text,
          },
        ];
      }
      if (row.numberOfServingsInPackage) {
        let text = '';
        row.numberOfServingsInPackage.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(new RegExp('(.+Usage\\:)(\\d+)(.+)', 'g'), '$2');
        });
        row.numberOfServingsInPackage = [
          {
            text: text,
          },
        ];
      }
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += item.text.replace(new RegExp('(.+)\\/$', 'g'), '$1');
          if (text === '/') {
            text = '';
          }
        });
        row.caloriesPerServing = [
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
