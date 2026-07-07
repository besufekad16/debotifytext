import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your HumanifyLab account to humanize AI text and manage your credits.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
