import server from './app';
import fs from 'fs';

const port = process.env.PORT || 8080;
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const version = packageJson.version;
process.env.VERSION = version;

//Inicia o servidor escutando na porta 8080
server.listen(port, () => {
	console.log(
		`App type ${process.env.NODE_ENV} listening on port ${port}! Version ${version}. http://localhost:${port}`
	);
});
