import path from "path";

/**
 * Arquivo centralizando as rotas
 * @export
 * @param {*} app
 * @param {*} server
 * @param {*} basePath
 */
export default function routers(app) {
	app.use("/musica/{id}", function (req, res, next) {
		const filePath = path.join(__dirname, "../musicas/exemplo.mp3");
		res.sendFile(filePath);
	});

	app.use("/list", function (req, res, next) {
		const musicFolder = path.join(__dirname, "../musicas");
		const files = fs.readdirSync(musicFolder);
		const musicFiles = files.filter((file) => file.endsWith(".mp3"));
		res.json({ files: musicFiles });
	});
}
