import axios from 'axios';
import * as actionTypes from './actionTypes';
import { ArticleEntity, CreateArticleEntity } from '../../model/article';
import { Dispatch } from 'redux';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


/* GET ARTICLE LIST */
export const getArticleList_ = (articles: ArticleEntity[]) => ({
	type: actionTypes.GET_ARTICLE_LIST,
	payload: articles,
});

export const getArticleList = () => {
	return async (dispatch: Dispatch<any>) => {
        const response = await axios.get(`/api/articles/`);
        
		dispatch(getArticleList_(response.data));
	};
}


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
}


/* CREATE ARTICLE */
export const createArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.CREATE_ARTICLE,
	payload: article,
});

export const createArticle = (article: CreateArticleEntity) => {
    return async (dispatch: Dispatch<any>) => {
        const bodyFormData = new FormData();
        bodyFormData.append('article', JSON.stringify(article));
        article.images.forEach(image => bodyFormData.append('image', image));

        const response = await axios({
            method: 'post',
            url: '/api/articles/',
            data: bodyFormData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        dispatch(createArticle_(response.data);
    };
}


/* EDIT ARTICLE */
export const editArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.EDIT_ARTICLE,
	payload: article,
});

export const editArticle = (id: number, article: CreateArticleEntity) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.put(`/api/articles/${id}/`, article)

		dispatch(editArticle_(response.data));
	};
}


/* DELETE ARTICLE */
export const deleteArticle_ = (article: ArticleEntity) => ({
	type: actionTypes.DELETE_ARTICLE,
	payload: article,
});

export const deleteArticle = (id: number) => {
    return async (dispatch: Dispatch<any>) => {
		const response = await axios.delete(`/api/articles/${id}/`)

		dispatch(deleteArticle_(response.data));
    };
}


export type ArticleAction =
	| ReturnType<typeof getArticleList_>
	| ReturnType<typeof getArticle_>
	| ReturnType<typeof createArticle_>
	| ReturnType<typeof editArticle_>
	| ReturnType<typeof deleteArticle_>;
