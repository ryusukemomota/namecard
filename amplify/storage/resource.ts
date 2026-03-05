import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'businessCardStorage',
  access: (allow) => ({
    'icons/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'vcf/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ]
  })
});
