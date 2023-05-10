import { String } from "runtypes";

export enum RoleEnum {
    USER = "USER",
    ADMIN = "ADMIN",
}

export const Role = String.withGuard((s): s is RoleEnum => {
    return Object.values(RoleEnum).includes(s as RoleEnum);
});
