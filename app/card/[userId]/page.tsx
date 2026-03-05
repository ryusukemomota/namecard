'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';
import { useParams } from 'next/navigation';

const client = generateClient<Schema>({
  authMode: 'apiKey'
});

export default function PublicCardPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [card, setCard] = useState<any>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCard();
  }, [userId]);

  const loadCard = async () => {
    try {
      console.log('公開ページ - userId:', userId);
      
      // 全件取得
      const { data: allData } = await client.models.BusinessCard.list();
      console.log('全カード:', allData);
      
      // クライアント側でownerフィルタリング
      const matchedCard = allData?.find(card => card.owner === userId);
      
      if (matchedCard) {
        console.log('マッチしたカード:', matchedCard);
        setCard(matchedCard);
        
        if (matchedCard.iconKey) {
          const url = await getUrl({ path: matchedCard.iconKey });
          setIconUrl(url.url.toString());
        }
      } else {
        console.log('該当するカードが見つかりません');
      }
    } catch (error) {
      console.error('カード読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadVCF = async () => {
    if (card?.vcfKey) {
      const url = await getUrl({ path: card.vcfKey });
      window.open(url.url.toString(), '_blank');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;
  }

  if (!card) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>名刺が見つかりません</div>;
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        padding: '2rem', 
        background: 'white', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {iconUrl && (
          <img 
            src={iconUrl} 
            alt="アイコン" 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              marginBottom: '1.5rem',
              objectFit: 'cover'
            }} 
          />
        )}
        
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.name}</h1>
        
        {card.company && (
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '0.25rem' }}>
            {card.company}
          </p>
        )}
        
        {card.position && (
          <p style={{ fontSize: '1rem', color: '#888', marginBottom: '1.5rem' }}>
            {card.position}
          </p>
        )}

        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          textAlign: 'left'
        }}>
          {card.email && (
            <p style={{ marginBottom: '0.75rem' }}>
              <strong>📧 メール:</strong> <a href={`mailto:${card.email}`}>{card.email}</a>
            </p>
          )}
          
          {card.phone && (
            <p style={{ marginBottom: '0.75rem' }}>
              <strong>📱 電話:</strong> <a href={`tel:${card.phone}`}>{card.phone}</a>
            </p>
          )}
          
          {card.website && (
            <p style={{ marginBottom: '0.75rem' }}>
              <strong>🌐 ウェブサイト:</strong> <a href={card.website} target="_blank" rel="noopener noreferrer">{card.website}</a>
            </p>
          )}
        </div>

        {(card.twitterUrl || card.linkedinUrl || card.githubUrl) && (
          <div style={{ 
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            {card.twitterUrl && (
              <a href={card.twitterUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem' }}>
                𝕏
              </a>
            )}
            {card.linkedinUrl && (
              <a href={card.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem' }}>
                in
              </a>
            )}
            {card.githubUrl && (
              <a href={card.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem' }}>
                🐙
              </a>
            )}
          </div>
        )}

        <button 
          onClick={downloadVCF}
          style={{ 
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          📇 連絡先を保存（VCF）
        </button>
      </div>
    </main>
  );
}
