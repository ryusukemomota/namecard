'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { uploadData, getUrl } from 'aws-amplify/storage';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export function BusinessCardManager({ user }: any) {
  const [card, setCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    twitterUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    try {
      setError('');
      const { data, errors } = await client.models.BusinessCard.list();
      console.log('カード読み込み:', data);
      console.log('エラー:', errors);
      
      if (data && data.length > 0) {
        const cardData = data[0];
        console.log('カードデータ:', cardData);
        setCard(cardData);
        setFormData({
          name: cardData.name || '',
          company: cardData.company || '',
          position: cardData.position || '',
          email: cardData.email || '',
          phone: cardData.phone || '',
          website: cardData.website || '',
          twitterUrl: cardData.twitterUrl || '',
          linkedinUrl: cardData.linkedinUrl || '',
          githubUrl: cardData.githubUrl || ''
        });
        
        if (cardData.iconKey) {
          try {
            const url = await getUrl({ path: cardData.iconKey });
            setIconUrl(url.url.toString());
          } catch (iconErr) {
            console.error('アイコン読み込みエラー:', iconErr);
          }
        }
      } else {
        console.log('カードが見つかりません');
      }
    } catch (err) {
      console.error('カード読み込みエラー:', err);
      setError('カードの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('フォーム送信開始');
      let iconKey = card?.iconKey;
      
      if (iconFile) {
        console.log('アイコンアップロード中...');
        const key = `icons/${user.userId}/${Date.now()}_${iconFile.name}`;
        await uploadData({ path: key, data: iconFile }).result;
        iconKey = key;
        console.log('アイコンアップロード完了:', key);
      }

      console.log('VCFファイル作成中...');
      const vcfContent = generateVCF(formData);
      const vcfKey = `vcf/${user.userId}/card.vcf`;
      await uploadData({
        path: vcfKey,
        data: vcfContent,
        options: { contentType: 'text/vcard' }
      }).result;
      console.log('VCFアップロード完了:', vcfKey);

      if (card) {
        console.log('カード更新中...', card.id);
        const updateData: any = {
          id: card.id,
          name: formData.name,
          iconKey,
          vcfKey
        };
        
        if (formData.company) updateData.company = formData.company;
        if (formData.position) updateData.position = formData.position;
        if (formData.email) updateData.email = formData.email;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.website) updateData.website = formData.website;
        if (formData.twitterUrl) updateData.twitterUrl = formData.twitterUrl;
        if (formData.linkedinUrl) updateData.linkedinUrl = formData.linkedinUrl;
        if (formData.githubUrl) updateData.githubUrl = formData.githubUrl;
        
        const result = await client.models.BusinessCard.update(updateData);
        console.log('カード更新完了:', result);
      } else {
        console.log('カード作成中...');
        const createData: any = {
          name: formData.name,
          iconKey,
          vcfKey
        };
        
        if (formData.company) createData.company = formData.company;
        if (formData.position) createData.position = formData.position;
        if (formData.email) createData.email = formData.email;
        if (formData.phone) createData.phone = formData.phone;
        if (formData.website) createData.website = formData.website;
        if (formData.twitterUrl) createData.twitterUrl = formData.twitterUrl;
        if (formData.linkedinUrl) createData.linkedinUrl = formData.linkedinUrl;
        if (formData.githubUrl) createData.githubUrl = formData.githubUrl;
        
        const result = await client.models.BusinessCard.create(createData);
        console.log('カード作成完了:', result);
      }

      await loadCard();
      alert('保存しました！');
    } catch (err) {
      console.error('保存エラー:', err);
      setError(`保存に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const generateVCF = (data: typeof formData) => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
ORG:${data.company}
TITLE:${data.position}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
END:VCARD`;
  };

  const downloadVCF = async () => {
    if (card?.vcfKey) {
      const url = await getUrl({ path: card.vcfKey });
      window.open(url.url.toString(), '_blank');
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          background: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>名前 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>会社名</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>役職</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>メール</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>電話番号</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>ウェブサイト</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Twitter URL</label>
          <input
            type="url"
            value={formData.twitterUrl}
            onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>GitHub URL</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>アイコン画像</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '0.75rem 2rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '保存中...' : (card ? '更新' : '作成')}
        </button>
      </form>

      {card && (
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px' }}>
          <h2>あなたの名刺プレビュー</h2>
          {iconUrl && <img src={iconUrl} alt="アイコン" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />}
          <p><strong>{card.name}</strong></p>
          {card.company && <p>{card.company}</p>}
          {card.position && <p>{card.position}</p>}
          {card.email && <p>{card.email}</p>}
          {card.phone && <p>{card.phone}</p>}
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>公開URL:</p>
            <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {typeof window !== 'undefined' && `${window.location.origin}/card/${user.userId}`}
            </code>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/card/${user.userId}`;
                navigator.clipboard.writeText(url);
                alert('URLをコピーしました！');
              }}
              style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              URLをコピー
            </button>
          </div>

          <button onClick={downloadVCF} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            VCFダウンロード
          </button>
        </div>
      )}
    </div>
  );
}
