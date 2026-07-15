export interface StrapiResponse<T> {
    data: T[],
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};

export interface StrapiSingleResponse<T> {
    data: T;
}

export interface StrapiEntity {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
}

export interface StrapiImageFormat {
    url: string;
    width: number;
    height: number;
}

export interface StrapiImage extends StrapiEntity {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail?: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
    } | null;
}

export interface Category extends StrapiEntity {
    name: string;
    slug: string;
    description: string | null;
    image?: StrapiImage | null;
    parentCategory?: Category | null;
}

export interface Attribute extends StrapiEntity {
    name: string;
    slug: string;
    values?: AttributeValue[];
}

export interface AttributeValue extends StrapiEntity {
    value: string;
    attribute?: Attribute;
}

export interface ProductVariant extends StrapiEntity {
    sku: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    isDefault: boolean;
    weight: number | null;
    attributeValues?: AttributeValue[];
    images?: StrapiImage[];
    product?: Product;
}

export interface Product extends StrapiEntity {
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    displayPrice: number | null;
    averageRating: number | null;
    reviewCount: number;
    isTrending: boolean | null;
    isBest: boolean | null;
    category?: Category | null;
    images?: StrapiImage[];
    variants?: ProductVariant[];
}

export interface HeroBanner extends StrapiEntity {
    title: string;
    subtitle: string | null;
    image: StrapiImage;
    linkUrl: string | null;
    displayOrder: number;
}