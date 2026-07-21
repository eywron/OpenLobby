import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
	logger.info(
		{
			port: env.PORT,
			environment: env.NODE_ENV
		},
		"OpenLobby backend server started"
	);
});

function shutdown(signal: NodeJS.Signals): void {
	logger.info({ signal }, "Shutting down OpenLobby backend server");

	server.close((error) => {
		if (error !== undefined) {
			logger.error({ error, signal }, "Error while closing backend server");
			process.exitCode = 1;
		}

		process.exit();
	});
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
