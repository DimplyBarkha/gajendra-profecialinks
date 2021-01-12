
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.descriptionBullets) {
          let text = '';
          row.descriptionBullets.forEach(item => {
            text += `${item.text.replace(/\n/g, '||')}  `;
          });
          row.descriptionBullets = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.category) {
            let text = '';
            row.category.forEach(item => {
              text += `${item.text.replace(/\s\n\s\n\s/g, '->')}  `;
            });
            row.category = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.variants) {
            let text = '';
            row.variants.forEach(item => {
              text += `${item.text.replace(/\n/g, ' | ')}  `;
            });
            row.variants = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.lbb) {
            let text = '';
            row.lbb.forEach(item => {
              text += `${item.text.replace(/\n/g, '')}  `;
              
            });
            row.lbb = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.description) {
            let text = '';
            row.description.forEach(item => {
              text += `${item.text
                .replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ')
                .replace(/\n\s*\n\s*/g, ' ')}  `;
            });
            row.description = [
              {
                text: text.trim(),
              },
            ];
          }
          if (row.specifications) {
            let text = '';
            row.specifications.forEach(item => {
                text += `${item.text
                    .replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ')
                    .replace(/\n\s*\n\s*/g, ' ')}  `;
            });
            row.specifications = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.productOtherInformation) {
            let text = '';
            row.productOtherInformation.forEach(item => {
                text += `${item.text
                    .replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ')
                    .replace(/\n\s*\n\s*/g, ' ')}  `;
            });
            row.productOtherInformation = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.manufacturerDescription) {
            let text = '';
            row.manufacturerDescription.forEach(item => {
                text += `${item.text
                    .replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ')
                    .replace(/\n\s*\n\s*/g, ' ')}  `;
            });
            row.manufacturerDescription = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  