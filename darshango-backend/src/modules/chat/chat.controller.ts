import { Request, Response } from 'express';
import axios from 'axios';

export const chatController = {
    sendMessage: async (req: Request, res: Response) => {
        try {
            const { chatInput } = req.body;

            if (!chatInput) {
                return res.status(400).json({ error: 'chatInput is required' });
            }

            const n8nUrl = 'https://sjaffer9019.app.n8n.cloud/webhook/62cec866-a049-43be-91ee-8a6e7bfdafe5/chat';

            // Generate a session ID (simple random string) to maintain context if supported
            const sessionId = req.body.sessionId || `session-${Math.random().toString(36).substring(7)}`;

            const response = await axios.post(n8nUrl, {
                chatInput,
                sessionId
            });

            return res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error in chat proxy:', error.message);

            let errorResponse: any = {
                error: 'Failed to communicate with chat assistant',
                details: error.message
            };

            if (axios.isAxiosError(error) && error.response) {
                console.error('n8n response status:', error.response.status);
                console.error('n8n response data:', JSON.stringify(error.response.data));

                // Pass the n8n error back to the frontend if it's an object
                if (typeof error.response.data === 'object') {
                    errorResponse = {
                        ...errorResponse,
                        n8nError: error.response.data
                    };
                } else {
                    errorResponse.n8nError = error.response.data;
                }
            }

            return res.status(500).json(errorResponse);
        }
    }
};
