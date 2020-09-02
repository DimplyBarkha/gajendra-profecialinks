
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			
			if (row.Image360Present) {				
				let newText = 'No';
				row.Image360Present.forEach(item => {					
					if (item.text.trim() > 0) {
						newText = 'YES';
					}
				});
				row.Image360Present = [{ text: newText }];
			}

			if (row.termsAndConditions) {				
				let newText = 'No';
				row.termsAndConditions.forEach(item => {					
					if (item.text.trim() > 0) {
						newText = 'YES';
					}
				});
				row.termsAndConditions = [{ text: newText }];
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