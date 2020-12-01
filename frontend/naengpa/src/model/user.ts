/* USER INTERFACE */
export interface UserEntity {
	id: string;
	name: string;
	username: string;
	dateOfBirth: string;
	email: string;
	region: string;
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
}

export interface EditUserInputDTO {
	id: string;
	name: string;
	password: string;
	dateOfBirth: string;
	email: string;
}
