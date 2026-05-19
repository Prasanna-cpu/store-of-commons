import {NextFunction, Response, Request} from "express";
import {logger} from "../logger/logger";
import {runInNewContext} from "node:vm";

export const requestLogger = (req : Request , res : Response, next : NextFunction) => {

    const start = Date.now()

    res.on("finish", () => {
        logger.info({
            method : req.method,
            url : req.url,
            status : res.statusCode,
            responseTime : Date.now() - start,
            ip: req.ip,
            timestamp : new Date().toISOString()
        })
    });

    next();

}