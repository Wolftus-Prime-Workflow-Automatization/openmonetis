function readEnvFlag(name: string): boolean {
	const value = process.env[name]?.trim().toLowerCase();
	return value === "true" || value === "1";
}

/** Instância single-user local sem landing pública nem checagem de update. */
export function isPersonalDeployment(): boolean {
	return readEnvFlag("PERSONAL_DEPLOYMENT");
}

/** Desliga fetch de versão no GitHub (automático em PERSONAL_DEPLOYMENT). */
export function isUpdateCheckDisabled(): boolean {
	return isPersonalDeployment() || readEnvFlag("DISABLE_UPDATE_CHECK");
}
