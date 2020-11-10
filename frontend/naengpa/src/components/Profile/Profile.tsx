import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Dictionary } from '../../model/general';
import './Profile.scss';

interface ProfileProps {
	profile: Dictionary<string | number>;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
	return (
		<Card id="profile">
			<CardHeader
				id="profile-card-header"
				avatar={<Avatar aria-label="user-image" src="/icons/boy.png" />}
				title={<Typography id="profile-title">{profile.username}</Typography>}
				subheader={<Typography id="profile-subheader">{profile.naengpa_score}</Typography>}
			/>
		</Card>
	);
};

export default Profile;
