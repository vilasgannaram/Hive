import 'reflect-metadata';
import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import AuthPayload from './auth.payload';
import LoginInput from './auth.input';
import AuthService from './auth.service';
import authMiddleware from '@middlewares/auth.middleware';

@Resolver()
export default class AuthResolver {
	@Mutation(() => AuthPayload)
	async login(
		@Arg('data', () => LoginInput) data: LoginInput
	): Promise<AuthPayload> {
		const { email, password } = data;
		return AuthService.login(email, password);
	}

	@Mutation(() => Boolean)
	@UseMiddleware(authMiddleware)
	async logout(): Promise<boolean> {
		console.log('logged out');
		return AuthService.logout();
	}

	// @Mutation(() => AuthPayload)
	// async refreshToken(): Promise<AuthPayload> {
	// 	return AuthService.refreshToken();
	// }

	// @Mutation(() => Boolean)
	// async resetPassword(
	// 	@Arg('email') email: string,
	// ): Promise<boolean> {
	// 	return AuthService.resetPassword(email, );
	// }
}
