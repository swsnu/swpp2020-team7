/* ARTICLE INTERFACE */

import { IngredientEntity } from './ingredient';

export interface ArticleOptions {
	isForSale: boolean;
	isForExchange: boolean;
	isForShare: boolean;
}
export interface CreateArticleEntity {
	title: string;
	content: string;
	item: string;
	price: string;
	options: ArticleOptions;
	images: File[];
}

export interface ArticleEntity {
	id: number;
	authorId: string;
	author: string;
	region: string;
	title: string;
	content: string;
	item: IngredientEntity;
	price: number;
	views: number;
	options: ArticleOptions;
	createdAt: string;
	images: ArticleImage[];
}

export interface ArticleImage {
	id: number;
	path: string;
}
