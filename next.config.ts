import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
	taint:true,
  },
  logging:{
	fetches:{
		fullUrl: true,
	},
  },
  images: {
	remotePatterns: [
		{
			hostname: "avatars.githubusercontent.com",
		},
	]
  }
};

export default nextConfig;
