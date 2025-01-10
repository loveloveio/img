import { createAuthClient, z } from "better-auth/react"
import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins"
export const authClient =  createAuthClient({
    plugins: [
        adminClient(),
        usernameClient(),
        inferAdditionalFields({
            user: {
                vipExpiredAt: {
                    type: 'date',
                    input: false,
                }
            }
        })
    ],
    
})