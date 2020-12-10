import React from 'react';
import { Card, CardHeader, Avatar, Typography } from '@material-ui/core';
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
				avatar={
					<Avatar
						aria-label="user-image"
						src={profile.profileImage as string}
						alt="/icons/boy.png"
					/>
				}
				title={
					<Typography id="profile-title" align="left">
						{profile.name}
					</Typography>
				}
				subheader={
					<div>
						<img id="profile-star" src="/icons/star.png" alt="/icons/star.png" />
						<Typography id="profile-subheader">{profile.naengpaScore}</Typography>
					</div>
				}
			/>
		</Card>
	);
};

export default Profile;
