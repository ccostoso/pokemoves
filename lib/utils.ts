import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { versionGroupList } from "./data/versiongroup-list"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getVersionGroupDisplayName(apiName: string = ""): string {
    // Look up the version group name from the list, and return the display name if found, 
    // otherwise return the API name as a fallback
    const versionGroup = versionGroupList.find(v => v.apiName === apiName)
    return versionGroup ? versionGroup.name : apiName
}
