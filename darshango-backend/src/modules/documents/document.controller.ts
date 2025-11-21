import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as documentService from './document.service';
import { uploadFileToStorage } from '../../storage/upload';
import { successResponse, errorResponse } from '../../utils/response';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // DocumentsTab.tsx → POST /projects/:id/documents → document.controller.uploadDocument → uploadFileToStorage → document.service.createDocument
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded', 400);
        }

        const publicUrl = await uploadFileToStorage(req.file, 'documents');

        const documentData = {
            title: req.body.title || req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            url: publicUrl,
            uploadedBy: req.user.id,
            category: req.body.category
        };

        const document = await documentService.createDocument(req.params.id, documentData);
        successResponse(res, document, 'Document uploaded successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await documentService.getDocuments(req.params.id);
        successResponse(res, documents);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        await documentService.deleteDocument(req.params.id, req.params.docId);
        successResponse(res, null, 'Document deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
