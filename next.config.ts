import dotenv from "dotenv";
import type { NextConfig } from "next";

// Carregar variáveis de ambiente explicitamente
dotenv.config();

type RemotePattern = NonNullable<
	NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const remotePatterns: RemotePattern[] = [
	{ protocol: "https", hostname: "lh3.googleusercontent.com" },
	{ protocol: "https", hostname: "img.logo.dev" },
];

if (process.env.S3_ENDPOINT) {
	try {
		const s3Url = new URL(process.env.S3_ENDPOINT);
		const protocol = s3Url.protocol.replace(":", "");
		if (protocol === "http" || protocol === "https") {
			remotePatterns.push({
				protocol,
				hostname: s3Url.hostname,
				...(s3Url.port ? { port: s3Url.port } : {}),
			});
		}
	} catch {
		// Ignore invalid S3_ENDPOINT — CSP in proxy.ts uses the same guard.
	}
}

const nextConfig: NextConfig = {
	output: "standalone",
	cacheComponents: true,
	reactCompiler: true,
	images: {
		remotePatterns,
	},
	devIndicators: {
		position: "bottom-right",
	},
	experimental: {
		prefetchInlining: true,
		turbopackFileSystemCacheForDev: true,
		optimizePackageImports: ["@remixicon/react"],
	},

	// Headers for Safari compatibility
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "X-Permitted-Cross-Domain-Policies",
						value: "none",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
