import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getArticleList = () => ({
  type: actionTypes.GET_ARTICLE_LIST, 
  payload: {}
});

export const getArticle = (id: number) => ({
  type: actionTypes.GET_ARTICLE, 
  payload: { id }
});

export const addArticle = (article: Array<string>) => ({
  type: actionTypes.ADD_ARTICLE, 
  payload: { article }
});

export const deleteArticle = (id: number) => ({
  type: actionTypes.DELETE_ARTICLE, 
  payload: { id }
});

export const editArticle = (id: number, article: Array<string>) => ({
  type: actionTypes.EDIT_ARTICLE, 
  payload: { id, article }
});


