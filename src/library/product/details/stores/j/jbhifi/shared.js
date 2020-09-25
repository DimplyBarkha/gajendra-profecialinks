
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.weightGross) {
        let text = '';
        let xpath = '';
        row.weightGross.forEach(item => {
          const unit = item.text.substring(item.text.indexOf('(') + 1, item.text.indexOf(')'));
          const weight = item.text.substring(item.text.indexOf('-') + 1, item.text.length);
          text = weight + unit;
          xpath = item.xpath;
        });
        row.weightGross = [
          {
            text: text.trim(),
            xpath: xpath,
          },
        ];
      }
      if (row.productOtherInformation) {
        const text = [];
        row.productOtherInformation.forEach(item => {
          text.push(item.text.trim());
        });
        row.productOtherInformation = [
          {
            text: text.join(' | '),
          },
        ];
      }
      if (row.alternateImages && row.image) {
        const alternateImagesArray = [];
        row.alternateImages.forEach((item, index) => {
          const tempItem = item.text.replace('-T-', '-L-');
          if (tempItem !== row.image[0].text) {
            alternateImagesArray.push(item.text);
          }
        });
        row.alternateImages = [];
        alternateImagesArray.forEach(element => {
          const temp = {
            text: 'https://www.jbhifi.co.nz' + element.replace('-T-', '-L-'),
          };
          row.alternateImages.push(temp);
        });
      }

      if (row.image) {
        let text = '';
        let xpath = '';
        row.image.forEach(item => {
          text = 'https://www.jbhifi.co.nz' + item.text;
          xpath = item.xpath;
        });
        row.image = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = row.manufacturerDescription.map(elm => elm.text).join(' ');
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }

      if (row.mpc) {
        let text = '';
        let xpath = '';
        row.mpc.forEach(item => {
          text = item.text.split(':')[1];
          xpath = item.xpath;
        });
        row.mpc = [
          {
            text: text.trim(),
            xpath: xpath,
          },
        ];
      }

      if (row.warranty) {
        let text = '';
        let xpath = '';
        row.warranty.forEach(item => {
          text = item.text.split('-')[1];
          xpath = item.xpath;
        });
        row.warranty = [
          {
            text: text.trim(),
            xpath: xpath,
          },
        ];
      }

      if (row.color) {
        let text = '';
        let xpath = '';
        row.color.forEach(item => {
          text = item.text.split('-')[1];
          xpath = item.xpath;
        });
        row.color = [
          {
            text: text.trim(),
            xpath: xpath,
          },
        ];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          text += item.text.trim() + ' || ';
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach((item, index) => {
          text += item.text.trim() + ' | ';
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.availabilityText) {
        let newText = 'Out Of Stock';
        row.availabilityText.forEach(item => {
          if (item.text.trim() === 'Add to Cart') {
            newText = 'In Stock';
          }
        });
        row.availabilityText = [{ text: newText }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        let xpath = '';
        row.manufacturerDescription.forEach(item => {
          text = item.text.replace(/«/g, '').replace(/»/g, '').replace(/|/g, '').replace(/« » |/g, '').replace(/(#.*{.*?})/gm, '');
          xpath = item.xpath;
        });
        row.manufacturerDescription = [
          {
            text: text,
            xpath: xpath,
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
