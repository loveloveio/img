import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins"
export const authClient =  createAuthClient({
    baseURL: 'http://localhost:3001',
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