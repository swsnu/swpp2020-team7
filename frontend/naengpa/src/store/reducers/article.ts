import * as actionTypes from '../actions/actionTypes';
import { ArticleEntity } from '../../model/article';
import { ArticleAction } from '../actions/article';
import { DefaultAction } from '../actions/index';

export type ArticleState = {
	articleList: ArticleEntity[];
	lastPageIndex: number;
	article: ArticleEntity | null;
};

const initialState: ArticleState = {
	articleList: [],
	lastPageIndex: 1,
	article: null,
};

function articleReducer(
	state: ArticleState = initialState,
	action: ArticleAction | DefaultAction = { type: 'default' },
): ArticleState {
	switch (action.type) {
		/* GET ARTICLE LIST */
		case actionTypes.GET_ARTICLE_LIST:
			return { ...state, articleList: action.articleList, lastPageIndex: action.lastPageIndex };

		/* GET ARTICLE LIST PAGE */
		case actionTypes.GET_PAGE_ARTICLE_LIST:
			return { ...state, articleList: [...state.articleList, ...action.pageArticleList], lastPageIndex: action.lastPageIndex };

		/* GET ARTICLE */
		case actionTypes.GET_ARTICLE:
			return { ...state, article: action.payload };

		/* CREATE ARTICLE */
		case actionTypes.CREATE_ARTICLE:
			return {
				...state,
				articleList: [...state.articleList, action.payload],
				article: action.payload,
			};

		/* EDIT ARTICLE */
		case actionTypes.EDIT_ARTICLE: {
			const modified = state.articleList.map((art) =>
				art.id === action.payload.id ? action.payload : art,
			);

			return {
				...state,
				articleList: modified,
				article: action.payload,
			};
		}

		/* DELETE ARTICLE */
		case actionTypes.DELETE_ARTICLE: {
			const deleted = state.articleList.filter((art) => art.id !== action.payload.id);

			return {
				...state,
				articleList: deleted,
				article: null,
			};
		}

		default:
			return state;
	}
}

export default articleReducer;
