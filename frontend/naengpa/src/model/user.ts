/* USER INTERFACE */
export interface UserEntity {
	id: string;
	name: string;
	username: string;
	dateOfBirth: string;
	email: string;
	region?: RegionEntity;
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
}

export interface EditUserInputDTO {
	id: string;
	name: string;
	password: string;
	dateOfBirth: string;
	email: string;
	region?: RegionEntity;
}

export interface RegionEntity {
	user_id?: number;
	id?: number;
	name: string;
	location: LocationEntity;
	distance: string;
}
export interface LocationEntity {
	latitude: string;
	longitude: string;
}
