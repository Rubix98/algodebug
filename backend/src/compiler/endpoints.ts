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
        let response = await sendRequestsToCompilerAPI(req.body);
        let numberOfErrors = response.filter((response) => !response.success).length;
        if (numberOfErrors === 0) {
            res.status(200).json(response);
        } else if (numberOfErrors < response.length) {
            res.status(206).json(response);
        } else {
            let errorMessage = response.map((response) => (!response.success ? response.error : "")).join("\n");
            res.status(400).json(errorMessage);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
