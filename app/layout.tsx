import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Colorisation Photos',
  description: 'Colorisez vos photos en noir et blanc grâce à l\'intelligence artificielle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
