import type { NextConfig } from "next";

// Gambar yang diunggah admin ke Supabase Storage (bucket public-images)
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/public-images/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
