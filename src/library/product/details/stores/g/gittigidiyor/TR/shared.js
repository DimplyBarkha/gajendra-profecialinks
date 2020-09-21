/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.availability) {
				row.availability[0].text = row.availability[0].text.includes('adet ürün stokta') ? 'InStock' : 'OutOfStock'
			}

			if (row.nameExtended) {
				let nameExtended = row.nameExtended[0].text;
				nameExtended = nameExtended[nameExtended.length - 1] === '-' ? nameExtended.substring(0, nameExtended.length - 1).trim() : nameExtended.trim()
				nameExtended = nameExtended[0] === '-' ? nameExtended.substring(1, nameExtended.length).trim() : nameExtended.trim()
				row.nameExtended = [{
					text: nameExtended
				}]
			}

			if (row.specValues) {
				let specValues = row.specValues;
				let specTitles = row.specTitles;
				let specStr = '';
				for (let i = 0; i < specTitles.length; i++) {
					specStr += `${specTitles[i].text} : ${specValues[i].text} | `
				}
				specStr = specStr.substring(0, specStr.lastIndexOf(' |'));
				row.specifications = [
					{
						text: specStr
					}
				]
			}
		}
	}

	// Clean up data
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
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
		.trim();

	data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
		el.text = clean(el.text);
	}))));

	return data;
};

module.exports = { transform };
