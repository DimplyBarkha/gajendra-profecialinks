
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.Image360Present) {
        let text = '';
        row.Image360Present.forEach(item => {
          text += item.text.replace(new RegExp('360°', 'g'), 'Yes');
        });
        row.Image360Present = [
          {
            text: text,
          },
        ];
      }
      if (row.technicalInformationPdfPresent) {
        let text = '';
        row.technicalInformationPdfPresent.forEach(item => {
          text += item.text.replace(new RegExp('Documents', 'g'), 'Yes');
        });
        row.technicalInformationPdfPresent = [
          {
            text: text,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += item.text.replace(/\n/g, ' ').replace(new RegExp('(.+)(Directions:)(.+)', 'g'), '$3');
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
