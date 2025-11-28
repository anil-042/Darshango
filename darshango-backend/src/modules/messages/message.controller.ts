import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as messageService from './message.service';
import { successResponse, errorResponse } from '../../utils/response';

import { uploadFileToStorage } from '../../storage/upload';

export const createMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const file = req.file;

        if (!content && !file) {
            return errorResponse(res, 'Message content or file is required', 400);
        }

        let attachment = undefined;
        if (file) {
            const fileUrl = await uploadFileToStorage(file);
            attachment = {
                url: fileUrl,
                name: file.originalname,
                type: file.mimetype.startsWith('image/') ? 'image' : 'document'
            };
        }

        const messageData = {
            projectId,
            senderId: req.user.id,
            senderName: req.user.name || 'User',
            content: content || '', // Allow empty content if file is present
            attachment,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const message = await messageService.createMessage(projectId, messageData);
        successResponse(res, message, 'Message sent successfully', 201);
    } catch (error: any) {
        console.error('Create message error:', error);
        errorResponse(res, error.message);
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const messages = await messageService.getProjectMessages(projectId);
        successResponse(res, messages);
    } catch (error: any) {
        console.error('Get messages error:', error);
        errorResponse(res, error.message);
    }
};
