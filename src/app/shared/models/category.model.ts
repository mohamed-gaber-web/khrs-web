export interface ICategory {
    id: number;
    categoryTranslations: CategoryTranslations[]
}

export interface CategoryTranslations {
    id: number;
    name: string
}