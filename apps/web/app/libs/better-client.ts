import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins"
console.log('@@@@process.env.APP_URL',process.env.APP_URL);
export const authClient =  createAuthClient({
    baseURL: process.env.APP_URL ?? 'http://localhost:3000',
    plugins: [
        adminClient(),
        usernameClient(),
        inferAdditionalFields({
            user: {
                vipExpiredAt: {
                    type: 'date',
                    input: false
                }
            }
        })
    ],
    
})