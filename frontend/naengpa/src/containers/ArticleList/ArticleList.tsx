import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { AppState } from '../../store/store';
import { getArticle, getArticleList } from '../../store/actions/index';
import Article from '../../components/Article/Article';
import { ArticleEntity, ArticleOptions } from '../../model/article';

import './ArticleList.scss';

interface ArticleListProps {
	history: History;
}

const ArticleList: React.FC<ArticleListProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const articleList = useSelector((state: AppState) => state.article.articleList);
	const dispatch = useDispatch();

	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<ArticleEntity[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const [optionsFilter, setOptionsFilter] = useState<ArticleOptions>({
		isForSale: false,
		isForExchange: false,
		isForShare: false,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [query, setQuery] = useState('');

	useEffect(() => {
		setLoading(true);
		dispatch(getArticleList(query, optionsFilter));
		setMaxPageIndex(Math.ceil(articleList.length / 9.0));
		setCurrentList(articleList.slice((page - 1) * 9, (page - 1) * 9 + 9));
		setLoading(false);
	}, [dispatch, optionsFilter.isForSale, optionsFilter.isForExchange, optionsFilter.isForShare]);

	const onClickOptions = (target: string) => {
		switch (target) {
			case 'sale':
				setOptionsFilter({ ...optionsFilter, isForSale: !optionsFilter.isForSale });
				break;
			case 'exchange':
				setOptionsFilter({ ...optionsFilter, isForExchange: !optionsFilter.isForExchange });
				break;
			case 'share':
				setOptionsFilter({ ...optionsFilter, isForShare: !optionsFilter.isForShare });
				break;
			default:
		}
	};
	const onClickSearch = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			dispatch(getArticleList(query));
			setMaxPageIndex(Math.ceil(articleList.length / 9.0));
			setCurrentList(articleList.slice((page - 1) * 9, (page - 1) * 9 + 9));
			setLoading(false);
		}
	};

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(articleList.slice((value - 1) * 9, (value - 1) * 9 + 9));
	};

	const onClickCreateArticle = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/articles/create');
	};

	const onClickArticle = (id: number) => async () => {
		dispatch(getArticle(id));
		history.push(`/articles/:${id}`);
	};

	const articles = currentList.map((item) => (
		<Article key={item.id} article={item} onClick={onClickArticle(item.id)} />
	));

	useEffect(() => {
		const func = async () => {
			dispatch(getArticleList(query));
			setMaxPageIndex(Math.ceil(articleList.length / 9.0));
			setCurrentList(articleList.slice((page - 1) * 9, (page - 1) * 9 + 9));
			setLoading(false);
		};
		func();
	}, [dispatch, articleList.length]);

	return (
		<div id="article-list">
			<div id="article-list-header">
				<div id="article-list-header-primary">
					<h1 id="article-list-header-title">우리 동네 장터</h1>
					<span>{user!.region}</span>
				</div>
				<div id="article-list-helper">
					<div id="article-search">
						<div id="article-search-box">
							<InputBase
								id="article-search-input"
								placeholder="찾고싶은 재료명을 검색해보세요!"
								inputProps={{ 'aria-label': 'search' }}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={onClickSearch}
							/>
							<SearchIcon id="article-list-search-icon" />
						</div>
						<div id="article-list-options-filter">
							<button
								id="most-recent-filter"
								className={optionsFilter.isForSale ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('sale')}
							>
								거래
							</button>
							<button
								id="most-popular-filter"
								className={optionsFilter.isForExchange ? 'selected' : ''}
								type="button"
								onClick={() => onClickOptions('exchange')}
							>
								교환
							</button>
							<button
								id="most-recommended-filter"
								className={optionsFilter.isForShare ? 'selected' : ''}
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
							글쓰기
						</button>
					</div>
				</div>
			</div>
			{!loading && <div id="article-cards">{articles}</div>}
			{loading && (
				<div id="article-cards">
					<CircularProgress color="inherit" />
				</div>
			)}
			<Pagination
				id="article-list-page"
				page={page}
				size="large"
				count={maxPageIndex}
				onChange={onChangePage}
			/>
		</div>
	);
};

export default React.memo(ArticleList);
