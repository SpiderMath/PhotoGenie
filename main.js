require('dotenv').config(); // Importing environment variables

// Importing the libraries
const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { readdirSync } = require('fs');


// Constant stuff
const app = express();
const PORT = process.env.PORT || 6969;
/**
 * @type {import('swagger-jsdoc').Options}
 */
const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'PhotoGenie',
			description: '',
		},
	},
	apis: ['./Routes/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);


// Useful functions
function setFile(dir) {
	const file = require(dir);

	app.use(file.end, file.router);
}

function setFolder(dir) {
	const routes = readdirSync(dir);

	routes
		.map((route) => {
			setFile(`${dir}/${route}`);
		});
}


// Real Action begins
app.listen(PORT, () => {
	console.log(`\x1b[93mListening for API calls on port ${PORT}`);
});

app.get('/', (req, res) => res.send('Ok test'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

setFolder('./Routes');
