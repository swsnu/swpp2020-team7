import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent } from '@material-ui/core';
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
				avatar={<Avatar aria-label="user-image" src='/icons/boy.png'></Avatar>}
				title={profile['username']}
				subheader={profile['naengpa_score']}
			/>
		</Card>
	);
};

export default Profile;
