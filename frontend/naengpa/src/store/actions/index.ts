/* User actions */
export {
	saveUserInfo,
	signup,
	login,
	logout,
	getUserList,
	getUser,
	editUser,
	changePassword,
	getChatRoomList,
	getChatRoom,
	createChatRoom,
	sendChat,
	deleteChatRoom, // should be deleted
} from './user';
export { getRegionList } from './region';

/* Fridge actions */
export {
	getFridge,
	addIngredientToFridge,
	deleteIngredientFromFridge,
	toggleTodayIngredient,
} from './fridge';

/* Recipe actions */
export {
	getRecipeList,
	getTodayRecipeList,
	getRecipe,
	getUserRecipes,
	createRecipe,
	extractMLFeatureFromRecipe,
	deleteRecipe,
	editRecipe,
	toggleRecipe,
} from './recipe';

/* Ingredient actions */
export { getIngredientList } from './ingredient';

/* FoodCategory actions */
export { getFoodCategoryList } from './foodCategory';

/* Article actions */
export {
	getArticleList,
	getPageArticleList,
	getArticle,
	createArticle,
	deleteArticle,
	editArticle,
} from './article';

/* Comment actions */
export {
	getCommentList_,
	getComment_,
	addComment,
	deleteComment,
	toggleCommentLike,
	editComment,
} from './comment';

export type DefaultAction = {
	type: 'default';
};
