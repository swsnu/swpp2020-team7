import axios from 'axios';
import { push } from 'connected-react-router';
import { Dispatch } from 'redux';
import * as actionTypes from './actionTypes';
import { ArticleEntity, ArticleOptions, CreateArticleEntity } from '../../model/article';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET ARTICLE LIST */
export const getArticleList_ = (articles: ArticleEntity[]) => ({
	type: actionTypes.GET_ARTICLE_LIST,
	payload: articles,
});

export const getArticleList = (query?: string, options?: ArticleOptions) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.get('/api/articles/', {
			params: {
				q: query,
				fs: options?.isForSale,
				fe: options?.isForExchange,
				fh: options?.isForShare,
			},
		});

		dispatch(getArticleList_(response.data));
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

export const editArticle = (id: number, article: CreateArticleEntity) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.put(`/api/articles/${id}/`, article);

		dispatch(editArticle_(response.data));
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
	| ReturnType<typeof getArticle_>
	| ReturnType<typeof createArticle_>
	| ReturnType<typeof editArticle_>
	| ReturnType<typeof deleteArticle_>;
