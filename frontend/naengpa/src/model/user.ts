/* USER INTERFACE */
export interface UserEntity {
	id: number;
	name: string;
	username: string;
	dateOfBirth: string;
	email: string;
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
