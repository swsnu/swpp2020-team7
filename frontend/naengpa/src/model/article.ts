/* ARTICLE INTERFACE */

export interface ArticleOptions {
	isForSale: Boolean;
	isForExchange: Boolean;
	isForShare: Boolean;
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
	item: string;
	price: number;
	views: number;
	options: ArticleOptions;
	createdAt: string;
	images: ArticleImage[];
}

export interface ArticleImage {
	id: number;
	file_path: string;
}
