import { Request, Response } from 'express';
import { validateCode } from '../services/dbservice';
import { parseOutput } from '../services/codeservice';
import { CodexApiResponse } from '../types/compiler';

export const compileCode = async (req: Request, res: Response) => {
    const [isOk, data] = validateCode(req.body);

    if (!isOk) {
        res.status(400).json({ error: 'Invalid request body: ' + data });
        return;
    }
    try {
        // for each input send new request
        let results: CodexApiResponse[] = [];

        for (const input of data.inputs) {
            const body = { code: data.code, input, language: data.language };
            
            const result = await fetch(process.env.COMPILER_URL as string, { 
                method: 'POST', 
                body: JSON.stringify(body), 
                headers: { 'Content-Type': 'application/json' } 
            });

            results.push(await result.json());
        }
        // process results
        const output = parseOutput(results);
        res.status(200).json(output);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
