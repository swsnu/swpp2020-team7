import React, { useEffect, MouseEvent, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import CreateIcon from '@material-ui/icons/Create';
import { ArticleEntity } from '../../model/article';
import Article from '../../components/Article/Article';
import { getArticleList } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './ArticleList.scss';

interface ArticleListProps {
	history: History;
}

const ArticleList: React.FC<ArticleListProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const articleList = useSelector((state: AppState) => state.article.articleList);
	const lastPageIndex = useSelector((state: AppState) => state.article.lastPageIndex);
	const dispatch = useDispatch();

	const [page, setPage] = useState(1);
	const [maxPageIndex, setMaxPageIndex] = useState(lastPageIndex);
	const [isForSale, setForSale] = useState(true);
	const [isForExchange, setForExchange] = useState(true);
	const [isForShare, setForShare] = useState(true);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	const onLoadPage = useCallback(async () => {
		if (loading) {
			await dispatch(getArticleList(query, {isForSale, isForExchange, isForShare}, page));
			setMaxPageIndex(lastPageIndex);
			setLoading(false);
		}
	}, [lastPageIndex, loading, page, query, isForExchange, isForExchange, isForShare]);

	useEffect(() => {
		onLoadPage();
	}, [onLoadPage]);

	const onClickOptions = (target: string) => {
		switch (target) {
			case 'sale':
				setForSale((state) => !state);
				break;
			case 'exchange':
				setForExchange((state) => !state);
				break;
			case 'share':
				setForShare((state) => !state);
				break;
			default:
		}
		setLoading(true);
	};

	const onClickSearch = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setQuery(e.target.value);
			setPage(1);
			setLoading(true);
		}
	};

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setLoading(true);
	};

	const onClickCreateArticle = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/articles/create');
	};

	const articles = articleList?.map((item: ArticleEntity) => (
		<Article key={item.id} article={item} history={history} />
	));

	return (
		<div id="article-list">
			<div id="article-list-header">
				<div id="article-list-header-primary">
					<h1 id="article-list-header-title">우리 동네 장터</h1>
					<span>{user!.region.name}</span>
				</div>
				<div id="article-list-helper">
					<div id="article-search">
						<div id="article-search-box">
							<InputBase
								id="article-search-input"
								placeholder="찾고싶은 재료명을 검색해보세요!"
								fullWidth
								inputProps={{ 'aria-label': 'search' }}
								onKeyDown={onClickSearch}
							/>
							<SearchIcon id="article-list-search-icon" />
						</div>
						<div id="article-list-options-filter">
							<button
								id="most-recent-filter"
								className={isForSale ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('sale')}
							>
								거래
							</button>
							<button
								id="most-popular-filter"
								className={isForExchange ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('exchange')}
							>
								교환
							</button>
							<button
								id="most-recommended-filter"
								className={isForShare ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('share')}
							>
								나눔
							</button>
						</div>
					</div>
					<div id="article-list-create-article">
						<button
							id="create-article-button"
							type="button"
							onClick={onClickCreateArticle}
						>
							글쓰기&nbsp;
							<CreateIcon id="article-list-create-icon" />
						</button>
					</div>
				</div>
			</div>
			<div id={`article-cards-${loading}`}>
				{loading ? <CircularProgress id="loading-bar" color="inherit" /> : <>{articles}</>}
			</div>
			{!loading &&
				(articleList?.length ? (
					<Pagination
						id="article-list-page"
						page={page}
						size="large"
						count={Math.ceil(maxPageIndex / 9.0)}
						onChange={onChangePage}
					/>
				) : (
					<div id="vacant-article"> 해당 조건의 게시글이 존재하지 않아요!</div>
				))}
		</div>
	);
};

export default React.memo(ArticleList);
