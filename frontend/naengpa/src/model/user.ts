/* USER INTERFACE */
export interface UserEntity {
	id: string;
	name: string;
	username: string;
	dateOfBirth: string;
	email: string;
	region: RegionEntity;
	naengpaScore?: number;
	regionRange?: number;
	profileImage?: File | string;
	notifications?: NotificationEntity[];
	totalNotifications?: number;
}

export interface UserLoginInputDTO {
	username: string;
	password: string;
}

export interface UserSignupInputDTO {
	name: string;
	username: string;
	password: string;
	dateOfBirth: string;
	email: string;
	region?: RegionEntity;
	regionRange?: number;
}

export interface EditUserInputDTO {
	id: string;
	name: string;
	password: string;
	dateOfBirth: string;
	email: string;
	region?: RegionEntity;
	regionRange?: string;
	profileImage?: File | null;
}

export interface ChangePasswordInputDTO {
	id: string;
	currentPassword: string;
	newPassword: string;
}

export interface RegionEntity {
	id?: number;
	name: string;
	location?: LocationEntity;
}
export interface LocationEntity {
	latitude: number;
	longitude: number;
}

export interface NotificationEntity {
	id: number;
	content: string;
	category: string | null;
	targetId: number | null;
	createdAt: string;
	deleted: boolean;
}
