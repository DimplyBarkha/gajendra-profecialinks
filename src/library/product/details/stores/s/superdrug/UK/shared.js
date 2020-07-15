
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.warnings = [
          {
            text: text,
          },
        ];
      }

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

      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.ingredientsList = [
          {
            text: text,
          },
        ];
      }

      if (row.recyclingInformation) {
        let text = '';
        row.recyclingInformation.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.recyclingInformation = [
          {
            text: text,
          },
        ];
      }

      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text = row.directions.map(elm => elm.text).join(' ');
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
