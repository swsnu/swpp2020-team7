import React, { useEffect, MouseEvent, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import CreateIcon from '@material-ui/icons/Create';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from '@material-ui/lab';
import { Card, CardContent, CardHeader, createStyles, makeStyles, Theme } from '@material-ui/core';
import { ArticleEntity } from '../../model/article';
import Article from '../../components/Article/Article';
import { getArticleList, getPageArticleList } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './ArticleList.scss';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 260,
			width: '30%',
			margin: theme.spacing(1),
			minHeight: 400,
			display: 'flex',
			flexDirection: 'column',
			flexFlow: 'wrap',
			justifyContent: 'space-between',
			padding: 0,
		},
		media: {
			width: '100%',
			height: 300,
		},
	}),
);
interface ArticleListProps {
	history: History;
}

const ArticleList: React.FC<ArticleListProps> = ({ history }) => {
	const classes = useStyles();
	const user = useSelector((state: AppState) => state.user.user);
	const articleList = useSelector((state: AppState) => state.article.articleList);
	const lastPageIndex = useSelector((state: AppState) => state.article.lastPageIndex);
	const dispatch = useDispatch();

	const [page, setPage] = useState(1);
	const [isForSale, setForSale] = useState(true);
	const [isForExchange, setForExchange] = useState(true);
	const [isForShare, setForShare] = useState(true);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	const onLoadPage = useCallback(async () => {
		if (loading) {
			if (page === 1) {
				await dispatch(getArticleList(query, { isForSale, isForExchange, isForShare }));
			} else {
				await dispatch(
					getPageArticleList(query, { isForSale, isForExchange, isForShare }, page),
				);
			}
			setLoading(false);
		}
	}, [loading]);

	useEffect(() => {
		onLoadPage();
	}, [onLoadPage]);

	const onClickOptions = (target: string) => {
		setPage(1);
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

	const onClickCreateArticle = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/articles/create');
	};

	const loaderTemplate = () => {
		let totalSkeletons = 0;
		if (!articleList || !articleList.length) {
			totalSkeletons = 6;
		} else if (
			lastPageIndex - articleList.length > 0 &&
			lastPageIndex - articleList.length < 9
		) {
			totalSkeletons = lastPageIndex - articleList.length;
		} else {
			totalSkeletons = 6;
		}
		return Array.from(Array(totalSkeletons)).map((_) => (
			<Card className={classes.card}>
				<CardHeader
					avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
					title={<Skeleton animation="wave" height={25} width="40%" />}
				/>
				<Skeleton animation="wave" variant="rect" className={classes.media} />
				<CardContent>
					<>
						<Skeleton animation="wave" height={30} style={{ marginBottom: 6 }} />
						<Skeleton animation="wave" height={15} style={{ marginBottom: 6 }} />
						<Skeleton animation="wave" height={15} width="80%" />
					</>
				</CardContent>
			</Card>
		));
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
				<InfiniteScroll
					dataLength={articleList?.length}
					next={() => {
						if (!loading) {
							setPage(page + 1);
							setLoading(true);
						}
					}}
					hasMore={articleList?.length < lastPageIndex}
					loader={loaderTemplate()}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<h4>더 이상 게시물이 없어요!</h4>
						</p>
					}
				>
					{articles}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default React.memo(ArticleList);
