import { Request, Response } from "express";
import { validateCode } from "./service";
import { sendRequestsToCompilerAPI } from "./service";

export const compileCode = async (req: Request, res: Response) => {
    const [isOk, data] = validateCode(req.body);

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + data });
        return;
    }
    try {
        const [isOk, response] = await sendRequestsToCompilerAPI(req.body);
        let status = isOk ? 200 : 400;
        res.status(status).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
