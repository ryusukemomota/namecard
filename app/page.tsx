'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BusinessCardManager } from './components/BusinessCardManager';

export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h1>デジタル名刺</h1>
            <button onClick={signOut}>ログアウト</button>
          </header>
          <BusinessCardManager user={user} />
        </main>
      )}
    </Authenticator>
  );
}
