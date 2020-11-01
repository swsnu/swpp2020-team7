import * as React from 'react';

interface ArticleProps {
	title: string;
	content: string;
}

const Article: React.FC<ArticleProps> = ({ title, content }) => {
	return (
		<div>
			Article title = {title}
			content = {content}
		</div>
	);
};

export default Article;
