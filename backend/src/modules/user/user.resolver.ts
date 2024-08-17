import 'reflect-metadata';
import {
	Arg,
	Resolver,
	Ctx,
	Query,
	FieldResolver,
	Root,
	Int,
	Mutation,
	UseMiddleware,
} from 'type-graphql';
import * as bcrypt from 'bcryptjs';

import User, { UserProfile, UserImage } from './user.schema';
import UserService from './user.service';
import { CreateUserInput } from './user.input';
import Context from '@config/context';
import authMiddleware from '@middlewares/auth.middleware';

@Resolver(User)
export default class UserResolver {
	//  Queries:

	//  Query single user
	@Query(() => User, { nullable: true })
	async user(@Arg('id', () => Int) id: number): Promise<User | null> {
		return await UserService.getUserById(id);
	}

	// Query all users
	@Query(() => [User])
	async users(): Promise<User[]> {
		return await UserService.getUsers();
	}

	// Query loggedIn user
	@Query(() => User, { nullable: true })
	@UseMiddleware(authMiddleware)
	async me(@Ctx() ctx: Context): Promise<User | null> {
		return await UserService.getUserById(Number(ctx.userId));
	}

	// Field Resolver: Profile field
	@FieldResolver(() => UserProfile, { nullable: true })
	async profile(@Root() user: User): Promise<UserProfile | null> {
		return await UserService.getUserProfileByUserId(user.id);
	}

	// Field Resolver: Images field
	@FieldResolver(() => [UserImage], { nullable: true })
	async images(@Root() profile: UserProfile): Promise<UserImage[] | null> {
		return UserService.getUserImagesByProfileId(profile.id);
	}

	//  MUTATIONS:
	//  createUser
	@Mutation(() => User)
	async createUser(
		@Arg('data', () => CreateUserInput) data: CreateUserInput
	): Promise<User | null> {
		const hashedPassword = await bcrypt.hash(data.password, 12);

		return await UserService.createUser({
			...data,
			password: hashedPassword,
		});
	}
}
