import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free DebotifyText account to humanize AI text with monthly free word credits.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
