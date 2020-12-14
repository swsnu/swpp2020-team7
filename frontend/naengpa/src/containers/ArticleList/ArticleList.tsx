import React, { useEffect, MouseEvent, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import CreateIcon from '@material-ui/icons/Create';
import { ArticleEntity } from '../../model/article';
import Article from '../../components/Article/Article';
import { getArticle, getArticleList } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './ArticleList.scss';
import FeedLoading from '../../components/FeedLoading/FeedLoading';

interface ArticleListProps {
	history: History;
}

const ArticleList: React.FC<ArticleListProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const articleList = useSelector((state: AppState) => state.article.articleList);
	const dispatch = useDispatch();

	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<ArticleEntity[]>(articleList);
	const [currentPage, setCurrentPage] = useState<ArticleEntity[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const [forSale, setForSale] = useState<boolean>(true);
	const [forExchange, setForExchange] = useState<boolean>(true);
	const [forShare, setForShare] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(true);
	const [query, setQuery] = useState('');

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

	const onClickSearch = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
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

	const onClickArticle = (id: number) => async () => {
		await dispatch(getArticle(id));
		history.push(`/articles/:${id}`);
	};

	const onLoadPage = useCallback(async () => {
		if (loading) {
			await dispatch(
				getArticleList(query, {
					isForExchange: forExchange,
					isForSale: forSale,
					isForShare: forShare,
				}),
			);
			setCurrentList(
				forShare || forSale || forExchange
					? articleList.filter(
							(a) =>
								(forShare && a.options.isForShare) ||
								(forSale && a.options.isForSale) ||
								(forExchange && a.options.isForExchange),
					  )
					: articleList,
			);
			setCurrentPage(currentList.slice((page - 1) * 9, (page - 1) * 9 + 9));
			setLoading(false);
		}
	}, [page, query, forSale, forExchange, forShare]);

	const loadingFeeds = () => {
		const feedCount = 9;
		const feeds = [];
		for (let i = 0; i < feedCount; i += 1) {
			feeds.push(<FeedLoading attribute="cardList" />);
		}
		return feeds;
	};

	const articles = currentPage.map((item) => (
		<Article key={item.id} article={item} onClick={onClickArticle(item.id)} />
	));

	useEffect(() => {
		onLoadPage();
	}, [onLoadPage]);

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
								onChange={(e) => {
									setQuery(e.target.value);
									setLoading(true);
								}}
								onKeyDown={onClickSearch}
							/>
							<SearchIcon id="article-list-search-icon" onKeyDown={onClickSearch} />
						</div>
						<div id="article-list-options-filter">
							<button
								id="most-recent-filter"
								className={forSale ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('sale')}
							>
								거래
							</button>
							<button
								id="most-popular-filter"
								className={forExchange ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('exchange')}
							>
								교환
							</button>
							<button
								id="most-recommended-filter"
								className={forShare ? 'selected' : ''}
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
			<div id="article-cards">{loading ? loadingFeeds() : <>{articles}</>}</div>
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
					<div id="vacant-article"> 해당 조건의 게시글이 존재하지 않습니다!</div>
				))}
		</div>
	);
};

export default React.memo(ArticleList);
