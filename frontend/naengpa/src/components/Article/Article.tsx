import React from 'react';
import { History } from 'history';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ArticleEntity, ArticleImage } from '../../model/article';
import { Dictionary } from '../../model/general';

import './Article.scss';

interface ArticleProps {
	article: ArticleEntity;
	history: History;
}

const Article: React.FC<ArticleProps> = ({ article, history }) => {
	const thumbnail: ArticleImage = article.images[0];
	const foodCategory: Dictionary<string> = {
		과일류: 'fruit.png',
		채소류: 'vegetable.png',
		고기류: 'meat.png',
		'수산물/건해산': 'seafood.png',
		'우유/유제품': 'milk.png',
		'계란/알류': 'egg.png',
		가공육: 'ham.png',
		'두부/콩류': 'tofu.png',
		'면/만두/떡류': 'noodles.png',
		'즉석식품/통조림': 'can.png',
		'소스/잼류': 'sauces.png',
		'김치/장류': 'kimchi.png',
		양념류: 'spices.png',
		곡류: 'rice.png',
	};
	const path = `foodCategory/${foodCategory[article.item.category]}`;

	return (
		<Card id="article-card" onClick={() => history.push(`/articles/${article.id}`)}>
			<CardHeader
				id="article-card-header"
				avatar={<Avatar src={path} aria-label="article" />}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				disableTypography
				title={article.item.name}
			/>
			<CardMedia id="article-image" image={thumbnail.file_path} />
			<div id="article-card-content">
				<CardContent id="article-title">{article.title}</CardContent>
				<CardContent id="article-region">{article.region}</CardContent>
			</div>
			<div id="article-card-footer">
				<div id="article-price">{`${article.price}원`}</div>
				<div id="article-options">
					{article.options.isForSale && (
						<button type="button" id="article-options-sale">
							거래
						</button>
					)}
					{article.options.isForExchange && (
						<button type="button" id="article-options-exchange">
							교환
						</button>
					)}
					{article.options.isForShare && (
						<button type="button" id="article-options-share">
							나눔
						</button>
					)}
				</div>
			</div>
		</Card>
	);
};

export default Article;
