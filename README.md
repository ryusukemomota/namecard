# デジタル名刺サービス

Amplify Gen2で構築したデジタル名刺管理アプリ

## 機能

- ✅ Cognito認証（メールログイン）
- ✅ Owner-based Authorization（自分のデータだけアクセス可能）
- ✅ DynamoDBでプロフィール管理
- ✅ S3でアイコン画像とVCFファイル保存
- ✅ GraphQL API（AppSync）
- ✅ Next.js + React フロントエンド

## セットアップ

```bash
npm install
npx ampx sandbox
```

別ターミナルで:
```bash
npm run dev
```

http://localhost:3000 でアクセス

## デプロイ

```bash
npx ampx sandbox delete  # サンドボックス削除
git init
git add .
git commit -m "initial commit"
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```
