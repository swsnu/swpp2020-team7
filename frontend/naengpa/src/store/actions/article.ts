import axios from 'axios';
import * as actionTypes from './actionTypes';

function getArticleList() {
	return {
		type: actionTypes.GET_ARTICLE_LIST,
		payload: {},
	};
}

function getArticle(id: number) {
	return {
		type: actionTypes.GET_ARTICLE,
		payload: { id },
	};
}

function createArticle(article: Array<string>) {
	return {
		type: actionTypes.CREATE_ARTICLE,
		payload: { article },
	};
}

function deleteArticle(id: number) {
	return {
		type: actionTypes.DELETE_ARTICLE,
		payload: { id },
	};
}

function editArticle(id: number, article: Array<string>) {
	return {
		type: actionTypes.EDIT_ARTICLE,
		payload: { id, article },
	};
}

export type ArticleActions =
	| ReturnType<typeof getArticleList>
	| ReturnType<typeof getArticle>
	| ReturnType<typeof createArticle>
	| ReturnType<typeof deleteArticle>
	| ReturnType<typeof editArticle>;
