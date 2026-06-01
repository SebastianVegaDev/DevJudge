import type { RequestHandler } from "express";
import {
    createAdminTestCase,
    deleteAdminTestCase,
    listAdminTestCases,
    updateAdminTestCase,
} from "./adminTestCases.service.js";

function getErrorStatus(message: string) {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes("not found")) {
        return 404;
    }

    if (
        normalizedMessage.includes("required") ||
        normalizedMessage.includes("must") ||
        normalizedMessage.includes("invalid")
    ) {
        return 400;
    }

    return 500;
}

function readParam(value: string | string[] | undefined, label: string) {
    if (Array.isArray(value) || !value?.trim()) {
        throw new Error(`${label} id is required`);
    }

    return value;
}

export const listTestCasesController: RequestHandler = async (req, res) => {
    try {
        const challengeId = readParam(req.params.challengeId, "Challenge");
        const testCases = await listAdminTestCases(challengeId);

        res.json({
            testCases,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const createTestCaseController: RequestHandler = async (req, res) => {
    try {
        const challengeId = readParam(req.params.challengeId, "Challenge");
        const testCase = await createAdminTestCase(challengeId, req.body);

        res.status(201).json({
            testCase,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const updateTestCaseController: RequestHandler = async (req, res) => {
    try {
        const testCaseId = readParam(req.params.testCaseId, "Test case");
        const testCase = await updateAdminTestCase(testCaseId, req.body);

        res.json({
            testCase,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const deleteTestCaseController: RequestHandler = async (req, res) => {
    try {
        const testCaseId = readParam(req.params.testCaseId, "Test case");
        const testCase = await deleteAdminTestCase(testCaseId);

        res.json({
            message: "Test case deleted successfully",
            testCase,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};