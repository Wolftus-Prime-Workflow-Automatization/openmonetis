#Requires -Version 7.0
<#
.SYNOPSIS
  Prepara .env para deploy pessoal local do OpenMonetis.
.DESCRIPTION
  Copia .env.personal.example para .env (se não existir) e gera secrets fortes.
  Não sobrescreve .env existente — use -Force para regenerar.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
	[switch]$Force
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Example = Join-Path $Root '.env.personal.example'
$Target = Join-Path $Root '.env'

function New-RandomBase64([int]$Bytes = 32) {
	$buffer = New-Object byte[] $Bytes
	[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buffer)
	return [Convert]::ToBase64String($buffer)
}

function New-RandomPassword([int]$Length = 32) {
	$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	$bytes = New-Object byte[] $Length
	[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
	return -join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })
}

if (-not (Test-Path $Example)) {
	throw "Arquivo não encontrado: $Example"
}

if ((Test-Path $Target) -and -not $Force) {
	Write-Host ".env já existe em $Target — nada alterado. Use -Force para recriar."
	exit 0
}

if ($PSCmdlet.ShouldProcess($Target, 'Criar .env pessoal com secrets gerados')) {
	$authSecret = New-RandomBase64
	$dbPassword = New-RandomPassword
	$minioPassword = New-RandomPassword

	$lines = Get-Content -Path $Example -Encoding UTF8
	$out = foreach ($line in $lines) {
		switch -Regex ($line) {
			'^POSTGRES_PASSWORD=' { "POSTGRES_PASSWORD=$dbPassword" }
			'^DATABASE_URL=' { "DATABASE_URL=postgresql://openmonetis:$dbPassword@localhost:5432/openmonetis_db" }
			'^BETTER_AUTH_SECRET=' { "BETTER_AUTH_SECRET=$authSecret" }
			'^MINIO_ROOT_PASSWORD=' { "MINIO_ROOT_PASSWORD=$minioPassword" }
			'^S3_SECRET_ACCESS_KEY=' { "S3_SECRET_ACCESS_KEY=$minioPassword" }
			default { $line }
		}
	}

	Set-Content -Path $Target -Value $out -Encoding UTF8
	Write-Host "Criado: $Target"
	Write-Host ""
	Write-Host "Próximos passos:"
	Write-Host "  docker compose -f docker-compose.personal.yml up -d --build"
	Write-Host "  http://localhost:3000/login"
	Write-Host ""
	Write-Host "Anexos (MinIO + pnpm dev):"
	Write-Host "  docker compose -f docker-compose.personal.yml --profile attachments up -d minio minio-init"
	Write-Host "  pnpm dev"
}
