
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
          text += item.text.replace(/[\n\t]+|<br>/g, ' ');
        });
        row.warnings = [
          {
            text: text.replace(/\s{2,}/g, ' ').trim(),
          },
        ];
      }

      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          item.text = item.text.replace(/[\n\t]+|<br>/g, ' ');
        });
        text = row.directions.map(item => item.text).join(' ');
        row.directions = [
          {
            text: text.replace(/\s{2,}/g, ' ').trim(),
          },
        ];
      }

      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList = row.ingredientsList.filter(item => item.text.trim().length);
        row.ingredientsList = row.ingredientsList.filter((item, index) => {
          const text = item.text;
          const textIndex = row.ingredientsList.findIndex(elm => elm.text === text);
          return index === textIndex;
        });
        row.ingredientsList.forEach(item => {
          item.text = item.text.replace(/[\n\t]+|<br>/g, ' ');
        });
        text = row.ingredientsList.map(item => item.text).join(' ');
        row.ingredientsList = [
          {
            text: text.replace(/\s{2,}/g, ' ').trim(),
          },
        ];
      }

      if (row.recyclingInformation) {
        let text = '';
        row.recyclingInformation.forEach(item => {
          item.text = item.text.replace(/[\n\t]+|<br>/g, ' ');
        });
        text = row.recyclingInformation.map(item => item.text).join(' ');
        row.recyclingInformation = [
          {
            text: text.replace(/\s{2,}/g, ' ').trim(),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          item.text = item.text.replace(/[\n\t]+|<br>/g, ' ');
        });
        row.description = row.description.filter((item, index) => {
          const text = item.text;
          const textIndex = row.description.findIndex(elm => elm.text === text);
          return index === textIndex;
        });
        text = row.description.map(item => item.text).join(' ');
        row.description = [
          {
            text: text.replace(/\s{2,}/g, ' ').trim(),
          },
        ];
      }

      if (row.descriptionBullets) {
        /** code to remove duplicates, some bullet points are repeated in website.
         * row.descriptionBullets = row.descriptionBullets.filter((item, index) => {
          const text = item.text;
          const textIndex = row.descriptionBullets.findIndex(elm => elm.text === text);
          return index === textIndex;
        }); */
        const text = row.descriptionBullets.length;
        row.descriptionBullets = [
          {
            text,
          },
        ];
      }

      if (row.availabilityText && row.availabilityText.length) {
        const stock = row.availabilityText[0].text.includes('InStock') ? 'In Stock' : 'Out Of Stock';
        row.availabilityText = [
          {
            text: stock,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
