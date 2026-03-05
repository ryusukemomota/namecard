import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  BusinessCard: a
    .model({
      name: a.string().required(),
      company: a.string(),
      position: a.string(),
      email: a.email(),
      phone: a.string(),
      website: a.url(),
      twitterUrl: a.url(),
      linkedinUrl: a.url(),
      githubUrl: a.url(),
      iconKey: a.string(),
      vcfKey: a.string()
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read'])
    ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
