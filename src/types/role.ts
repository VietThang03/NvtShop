export type TParamsGetRoles = {
    limit?: number
    page?: number
    search?: string
    order?: string
}

export type TCreateRole = {
    name: string
}

export type TEditRole = {
    name: string
    id: string,
    permissions?: string[]
}