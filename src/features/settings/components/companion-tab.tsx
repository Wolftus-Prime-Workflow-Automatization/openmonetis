"use client";

import {
	RiDownload2Line,
	RiExternalLinkLine,
	RiNotification3Line,
	RiQrCodeLine,
	RiShieldCheckLine,
	RiWifiLine,
} from "@remixicon/react";
import type { ReactNode } from "react";
import { ApiTokensForm } from "./api-tokens-form";

interface ApiToken {
	id: string;
	name: string;
	tokenPrefix: string;
	lastUsedAt: Date | null;
	lastUsedIp: string | null;
	createdAt: Date;
	expiresAt: Date | null;
	revokedAt: Date | null;
}

interface CompanionTabProps {
	tokens: ApiToken[];
}

const steps: {
	icon: typeof RiDownload2Line;
	title: string;
	description: ReactNode;
}[] = [
	{
		icon: RiDownload2Line,
		title: "Instale o app",
		description: (
			<>
				Baixe o APK no{" "}
				<a
					href="https://github.com/felipegcoutinho/openmonetis-companion"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-0.5 text-primary hover:underline"
				>
					GitHub
					<RiExternalLinkLine className="h-3 w-3" />
				</a>
			</>
		),
	},
	{
		icon: RiQrCodeLine,
		title: "Gere um token",
		description: "Crie um token abaixo para autenticar.",
	},
	{
		icon: RiNotification3Line,
		title: "Configure permissões",
		description: "Conceda acesso às notificações.",
	},
	{
		icon: RiShieldCheckLine,
		title: "Pronto!",
		description: "Notificações serão enviadas ao OpenMonetis.",
	},
];

export function CompanionTab({ tokens }: CompanionTabProps) {
	return (
		<div className="space-y-6">
			<div className="rounded-md border border-border/60 bg-muted/40 p-4 text-sm">
				<div className="flex items-start gap-3">
					<RiWifiLine className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">Uso seguro na rede local</p>
						<p className="text-muted-foreground">
							Configure o Companion com a URL do seu servidor na mesma rede Wi-Fi
							(ex.: <code className="text-xs">http://192.168.x.x:3000</code>).
							Não exponha a API <code className="text-xs">/api/inbox</code> na
							internet. Revogue o token ao trocar de celular ou se suspeitar de
							vazamento.
						</p>
					</div>
				</div>
			</div>

			{/* Steps */}
			<div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
				{steps.map((step, index) => (
					<div key={step.title} className="flex items-start gap-2">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
							<step.icon className="h-4 w-4" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-medium leading-tight">
								{index + 1}. {step.title}
							</p>
							<p className="text-xs text-muted-foreground">
								{step.description}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Devices */}
			<ApiTokensForm tokens={tokens} />
		</div>
	);
}
