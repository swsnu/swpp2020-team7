import * as actionTypes from './actionTypes';
import axios from 'axios';

/* createAction, handleActions를 typescript와 함께 사용할 때,
   string만을 return하는 문제로 번거롭지만 실습 때 배운 버전으로 사용하는 것이 나을 수 있음 */

// import {createAction, handleActions} from 'redux-actions';
// export const actionCreators = {
//   getArticleList: createAction(actionTypes.GET_ARTICLE_LIST),
//   getArticle: createAction(actionTypes.GET_ARTICLE_LIST),
//   addArticle: createAction(actionTypes.ADD_ARTICLE),
//   deleteArticle: createAction(actionTypes.DELETE_ARTICLE),
//   editArticle: createAction(actionTypes.EDIT_ARTICLE),
// };

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


