import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		cardList: {
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
		card: {
			minWidth: 200,
			height: 300,
			margin: theme.spacing(2),
		},
		media: {
			width: '100%',
			height: 300,
		},
	}),
);

interface FeedLoadingProps {
	attribute: string;
}

const FeedLoading: React.FC<FeedLoadingProps> = ({ attribute }) => {
	const classes = useStyles();
	return (
		<Card className={attribute === 'cardList' ? classes.cardList : classes.card}>
			<CardHeader
				avatar={<Skeleton animation="wave" variant="circle" width={50} height={40} />}
				title={
					<Skeleton
						animation="wave"
						height={10}
						width="80%"
						style={{ marginBottom: 6 }}
					/>
				}
				subheader={<Skeleton animation="wave" height={10} width="40%" />}
			/>
			<Skeleton animation="wave" variant="rect" className={classes.media} />
			<CardContent>
				<>
					<Skeleton animation="wave" height={5} style={{ marginBottom: 6 }} />
					<Skeleton animation="wave" height={5} width="80%" />
				</>
			</CardContent>
		</Card>
	);
};

export default FeedLoading;
