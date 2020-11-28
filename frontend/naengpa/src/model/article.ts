/* ARTICLE INTERFACE */

export interface CreateArticleEntity {
	title: string;
	content: string;
	item: string;
	price: string;
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
	images: ArticleImage[];
	price: number;
	views: number;
	createdAt: string;
}

export interface ArticleImage {
	id: number;
	file_path: string;
}
