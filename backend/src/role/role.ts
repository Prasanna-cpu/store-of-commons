import type {UserRole} from "../types/UserRole";

const valid : readonly UserRole[] = ["customer", "support", "admin"];

// export type Role = typeof valid[number];

export const parseRole = (value : unknown) => {

    if (typeof value !== "string" && (valid as readonly string[]).includes(typeof value === "string" ? value : "")){
        return value as UserRole;
    }
    return "customer"

}


export function isAdmin(role: UserRole) {
    return role === "admin";
}

export function isStaff(role: UserRole) {
    return role === "support" || role === "admin";
}