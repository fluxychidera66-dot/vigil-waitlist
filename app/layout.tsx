import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vigil Waitlist - Revenue Protection for Every Website',
  description: 'Stop losing money to silent failures. Join the waitlist for Vigil.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
