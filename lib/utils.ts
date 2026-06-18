import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { versionGroupList } from "./data/versiongroup-list"
import { types } from "./data/type-list"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getVersionGroupDisplayName(apiName: string = ""): string {
    // Look up the version group name from the list, and return the display name if found, 
    // otherwise return the API name as a fallback
    const versionGroup = versionGroupList.find(v => v.apiName === apiName)
    return versionGroup ? versionGroup.name : apiName
}

export function getTypeNumber(typeName: string): number {
    // Map Pokémon type names to numbers for sprite retrieval
    const type = types.find(t => t.name === typeName)
    return type ? type.id : 0 // Return 0 or a default value if not found
}
