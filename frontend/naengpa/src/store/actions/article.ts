import axios from 'axios';
import { push } from 'connected-react-router';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';
import * as actionTypes from './actionTypes';
import {
	ArticleEntity,
	ArticleOptions,
	CreateArticleEntity,
	EditArticleEntity,
} from '../../model/article';

/* GET ARTICLE LIST for the first time */
export const getArticleList_ = (articleList: ArticleEntity[], lastPageIndex: number) => ({
	type: actionTypes.GET_ARTICLE_LIST,
	articleList,
	lastPageIndex,
});

export const getArticleList = (query?: string, options?: ArticleOptions) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			const response = await axios.get('/api/articles/', {
				params: {
					q: query,
					fs: options?.isForSale,
					fe: options?.isForExchange,
					fh: options?.isForShare,
					p: 1,
				},
			});
			const { articleList, lastPageIndex } = response.data;
			dispatch(getArticleList_(articleList, lastPageIndex));
		} catch {
			toast.error('🦄 장터 게시글을 가져오지 못했습니다! 다시 시도해주세요!');
		}
	};
};

/* GET ARTICLE LIST for a certain page */
export const getPageArticleList_ = (pageArticleList: ArticleEntity[], lastPageIndex: number) => ({
	type: actionTypes.GET_PAGE_ARTICLE_LIST,
	pageArticleList,
	lastPageIndex,
});

export const getPageArticleList = (query?: string, options?: ArticleOptions, page?: number) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			const response = await axios.get('/api/articles/', {
				params: {
					q: query,
					fs: options?.isForSale,
					fe: options?.isForExchange,
					fh: options?.isForShare,
					p: page,
				},
			});
			const { articleList, lastPageIndex } = response.data;
			dispatch(getPageArticleList_(articleList, lastPageIndex));
		} catch {
			toast.error('🦄 장터 게시글을 가져오지 못했습니다! 다시 시도해주세요!');
		}
	};
};

/* GET ARTICLE */
export const getArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.GET_ARTICLE,
	payload: article,
});

export const getArticle = (id: number) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.get(`/api/articles/${id}/`);

		dispatch(getArticle_(response.data));
	};
};

/* CREATE ARTICLE */
export const createArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.CREATE_ARTICLE,
	payload: article,
});

export const createArticle = (article: CreateArticleEntity) => {
	return async (dispatch: Dispatch<any>) => {
		const form = new FormData();
		form.append('article', JSON.stringify(article));
		article.images.forEach((image) => form.append('image', image));

		const response = await axios.post('/api/articles/', form);

		dispatch(createArticle_(response.data));
		dispatch(push(`/articles/${response.data.id}`));
	};
};

/* EDIT ARTICLE */
export const editArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.EDIT_ARTICLE,
	payload: article,
});

export const editArticle = (id: number, article: EditArticleEntity) => {
	return async (dispatch: Dispatch<any>) => {
		const form = new FormData();
		form.append('article', JSON.stringify(article));
		article.images.forEach((image) => form.append('image', image));

		const response = await axios.put(`/api/articles/${id}/`, form);

		await dispatch(editArticle_(response.data));
		dispatch(push(`/articles/${response.data.id}`));
	};
};

/* DELETE ARTICLE */
export const deleteArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.DELETE_ARTICLE,
	payload: article,
});

export const deleteArticle = (id: number) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.delete(`/api/articles/${id}/`);

		dispatch(deleteArticle_(response.data));
	};
};

export type ArticleAction =
	| ReturnType<typeof getArticleList_>
	| ReturnType<typeof getPageArticleList_>
	| ReturnType<typeof getArticle_>
	| ReturnType<typeof createArticle_>
	| ReturnType<typeof editArticle_>
	| ReturnType<typeof deleteArticle_>;
