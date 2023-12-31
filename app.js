import express from 'express'; //Includes básicos do express
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';
import createError from 'http-errors'; //Usando para enviar erro 404
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Classe principal da aplicação
 */
class App {
	/**
	 * Creates an instance of App.
	 */
	constructor() {
		this.app = express(); //Includes básicos do express
		this.server = http.createServer(this.app); //Enviar requisições http
		this.middlewares(); //Adiciona os middlewares
		this.routes(); //Configura as rotas
	}

	/**
	 * Adiciona os middlewares
	 */
	middlewares() {
		this.app.use(morgan('dev')); //tratamentos de http
		this.app.use(express.json()); //reconhece solicitação de entrada como json
		this.app.use(express.urlencoded({ extended: false })); //reconhece o objeto de solicitação recebido como cadeias ou matrizes
		let allowedOrigins = [
			'localhost:8080', // sem o http para f5 desenvolvimento local
			'http://localhost:3000',
			'localhost:3000',
		];
		// Permitir varias origens no navegador, usado mais para desenvolvimento, embora acredito que sera usado para produção
		this.app.use((req, res, next) => {
			const origin = req.headers.origin || req.headers.host;
			console.log(origin);

			if (allowedOrigins.indexOf(origin) > -1) {
				res.setHeader('Access-Control-Allow-Origin', origin);
				res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
				res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
				res.header('Access-Control-Allow-Credentials', true);
				return next();
			} else {
				console.log(origin);
				console.log(allowedOrigins.indexOf(origin));
				res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
				res.status(403).send('Forbidden');
			}
		});
	}

	/**
	 * Configura as rotas
	 */
	routes() {
		// GET /version draw version from package.json
		this.app.get('/version', (req, res) => {
			try {
				res.status(200).send(process.env.VERSION);
			} catch (error) {
				res.sendStatus(500);
			}
		});
		// GET /api-docs docs da api swagger
		this.app.use(
			'/api-docs',
			swaggerUi.serve,
			swaggerUi.setup(yaml.parse(fs.readFileSync('./routes/swagger.yaml', 'utf8')))
		);

		this.app.use('/musica/{id}', function (req, res, next) {
			const filePath = path.join(__dirname, '../musicas/exemplo.mp3');
			res.sendFile(filePath);
		});

		this.app.get('/list', function (req, res, next) {
			const musicFolder = path.join(__dirname, './routes/public/musicas'); // pasta
			const files = fs.readdirSync(musicFolder);
			const musicFiles = files.filter((file) => file.endsWith('.mp3')); // filtra arquivos com extensão mp3
			const port = process.env.PORT || 8080;

			const musicList = musicFiles.map((file) => {
				const musicName = file.replace(/\.mp3$/, ''); // remove a extensão .mp3 do nome do arquivo
				const musicUrl = `http://localhost:${port}/musicas/${encodeURIComponent(file)}`; // adiciona o caminho da pasta public e codifica o nome do arquivo na URL
				return { name: musicName, url: musicUrl };
			});

			res.json(musicList);
		});
		//#endregion

		//Ordem especifica, 3º pasta publica
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		this.app.use(express.static(path.join(__dirname, 'routes', 'public'))); //Rota para a pasta public para midias
		this.app.use(express.static(path.join(__dirname, 'frontend', 'build'))); //Rota para a pasta public para o frontend react

		//Ordem especifica, 4º error handler 404
		this.app.use((err, req, res, next) => {
			// set locals, not providing error in production
			res.locals.message = err.message;
			res.locals.error = process.env.NODE_ENV === 'production' ? {} : err;
			console.warn('envolviment: ' + process.env.NODE_ENV);
			console.warn(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
			res.status(err.status || 500).send('error');
		});

		//Ordem especifica, 5º Manipuladores de errors catch 404 and forward to error handler
		this.app.use((req, res, next) => next(createError(404))); // tem que ser o ultimo a ser chamado
	}
}

export default new App().server;
