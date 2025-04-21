const url = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports?lat=19.242218017578125&lng=72.85846156046128&locale=en-US';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'a6116967d2mshe15941f28c56a6bp1893ccjsn2ef80dcbc827',
		'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}