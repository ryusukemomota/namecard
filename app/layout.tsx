import type { Metadata } from 'next';
import './globals.css';
import { ConfigureAmplify } from './configure-amplify';

export const metadata: Metadata = {
  title: 'デジタル名刺',
  description: 'あなたのデジタル名刺を管理'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  );
}
