import * as actionTypes from '../actions/actionTypes';
import { ArticleEntity } from '../../model/article';
import { ArticleAction } from '../actions/article';


export type ArticleState = {
	articleList: ArticleEntity[];
	article: ArticleEntity | null;
};

const initialState: ArticleState = {
	articleList: [],
	article: null,
};

function articleReducer (
    state: ArticleState = initialState, 
    action: ArticleAction,
 ): ArticleState {
	switch (action.type) {
		/* GET ARTICLE LIST */
		case actionTypes.GET_ARTICLE_LIST:
			return { ...state, articleList: action.payload };

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
		case actionTypes.EDIT_ARTICLE:
            const modified = state.articleList.map(art => 
                art.id === action.payload.id ? action.payload : art);

			return {
                ...state,
                articleList: modified,
                article: action.payload,
			};

		/* DELETE ARTICLE */
		case actionTypes.DELETE_ARTICLE:
            const deleted = state.articleList.filter(art => art.id !== action.payload.id);

			return {
                ...state,
                articleList: deleted,
                article: null,
            };

		default:
			return state;
	}
}

export default articleReducer;
