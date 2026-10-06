import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Management",
  description: "Manage your DebotifyText team members and shared credits.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
