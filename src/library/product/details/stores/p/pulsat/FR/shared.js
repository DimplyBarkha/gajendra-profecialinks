
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = item.text.replace('.', ',') + '€';
        });
        row.price = [
          {
            text: text,
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('.', ',') + '€';
        });
      }
      if (row.weightNet) {
        let text = '';
        let xpath = '';
        row.weightNet.forEach(item => {
          text = item.text.replace('.', ',');
          xpath = item.xpath;
        });
        row.weightNet = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.alternateImages) {
        for (let i = 0; i < row.alternateImages.length; i++) {
          row.alternateImages[i].text = row.alternateImages[i].text.replace('thumbnail/65x', 'image');
        }
      }

      if (row.availabilityText) {
        let newText = 'Out Of Stock';
        row.availabilityText.forEach(item => {
          if (item.text.trim() === 'Acheter maintenant' || item.text >= 1) {
            newText = 'In Stock';
          }
        });
        row.availabilityText = [{ text: newText }];
      }

      if (row.technicalInformationPdfPresent) {
        let text = '';
        row.technicalInformationPdfPresent.forEach(item => {
          if (item.text === 'Télécharger la fiche produit') {
            text = 'Yes';
          } else {
            text = 'No';
          }
        });
        row.technicalInformationPdfPresent = [
          {
            text: text,
          },
        ];
      }

      if (row.color) {
        let text = '';
        row.color.forEach(item => {
          text = row.color.map(elm => elm.text).join(' | ');
        });
        row.color = [
          {
            text: text,
          },
        ];
      }

      if (row.warranty) {
        let text = '';
        row.warranty.forEach(item => {
          text = row.warranty.map(elm => elm.text).join(' | ');
        });
        row.warranty = [
          {
            text: text,
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = row.manufacturerDescription.map(elm => elm.text.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim()).join(' | ');
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += (item.text + ' : ');
          } else {
            text += (item.text) + ' || ';
          }
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }

  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
