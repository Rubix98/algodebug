import { Request, Response } from "express";
import { verifyUser, logoutUser } from "../../services/authservice";

export const verify = async (req: Request, res: Response) => {
    await verifyUser(req, res);
};

export const logout = async (req: Request, res: Response) => {
    await logoutUser(req, res);
};
