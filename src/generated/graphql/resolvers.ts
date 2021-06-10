/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../../graphql/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type FieldWrapper<T> = T;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type CameraInput = {
  position: Vector3Input;
  up: Vector3Input;
  lookAt: Vector3Input;
};

export type ColorMaterial = {
  __typename?: 'ColorMaterial';
  opacity: FieldWrapper<Scalars['Float']>;
  glossiness: FieldWrapper<Scalars['Float']>;
  diffuse: FieldWrapper<Scalars['String']>;
  ambient: FieldWrapper<Scalars['String']>;
  specular: FieldWrapper<Scalars['String']>;
  emissive: FieldWrapper<Scalars['String']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  save: FieldWrapper<Scalars['Boolean']>;
};


export type MutationSaveArgs = {
  enabled: Scalars['Boolean'];
  sceneViewId: Scalars['ID'];
  camera?: Maybe<CameraInput>;
};

export type Part = {
  __typename?: 'Part';
  id: FieldWrapper<Scalars['ID']>;
  name: FieldWrapper<Scalars['String']>;
  created?: Maybe<FieldWrapper<Scalars['Date']>>;
  suppliedId?: Maybe<FieldWrapper<Scalars['String']>>;
};

export type PartRevision = {
  __typename?: 'PartRevision';
  id: FieldWrapper<Scalars['ID']>;
  partId?: Maybe<FieldWrapper<Scalars['ID']>>;
  created?: Maybe<FieldWrapper<Scalars['Date']>>;
  suppliedId?: Maybe<FieldWrapper<Scalars['String']>>;
};

export type Query = {
  __typename?: 'Query';
  sceneViewItem?: Maybe<FieldWrapper<SceneViewItem>>;
  partRevision?: Maybe<FieldWrapper<PartRevision>>;
  part?: Maybe<FieldWrapper<Part>>;
};


export type QuerySceneViewItemArgs = {
  sceneViewId: Scalars['ID'];
  itemId: Scalars['ID'];
};


export type QueryPartRevisionArgs = {
  revisionId: Scalars['ID'];
};


export type QueryPartArgs = {
  partId: Scalars['ID'];
};

export type SceneViewItem = {
  __typename?: 'SceneViewItem';
  id: FieldWrapper<Scalars['ID']>;
  suppliedId?: Maybe<FieldWrapper<Scalars['String']>>;
  visible: FieldWrapper<Scalars['Boolean']>;
  selected: FieldWrapper<Scalars['Boolean']>;
  transform: FieldWrapper<Transform>;
  materialOverride?: Maybe<FieldWrapper<ColorMaterial>>;
  worldTransform?: Maybe<Array<Maybe<FieldWrapper<Scalars['Float']>>>>;
  partRevisionId?: Maybe<FieldWrapper<Scalars['ID']>>;
};


export type SceneViewItemWorldTransformArgs = {
  sceneViewId: Scalars['ID'];
  itemId: Scalars['ID'];
};

export type Transform = {
  __typename?: 'Transform';
  position: FieldWrapper<Vector3>;
  rotation: FieldWrapper<Vector3>;
  scale: FieldWrapper<Scalars['Float']>;
};

export type Vector3 = {
  __typename?: 'Vector3';
  x: FieldWrapper<Scalars['Float']>;
  y: FieldWrapper<Scalars['Float']>;
  z: FieldWrapper<Scalars['Float']>;
};

export type Vector3Input = {
  x: Scalars['Float'];
  y: Scalars['Float'];
  z: Scalars['Float'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  CameraInput: CameraInput;
  ColorMaterial: ResolverTypeWrapper<ColorMaterial>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Part: ResolverTypeWrapper<Part>;
  PartRevision: ResolverTypeWrapper<PartRevision>;
  Query: ResolverTypeWrapper<{}>;
  SceneViewItem: ResolverTypeWrapper<SceneViewItem>;
  Transform: ResolverTypeWrapper<Transform>;
  Vector3: ResolverTypeWrapper<Vector3>;
  Vector3Input: Vector3Input;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CameraInput: CameraInput;
  ColorMaterial: ColorMaterial;
  Float: Scalars['Float'];
  String: Scalars['String'];
  Date: Scalars['Date'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Part: Part;
  PartRevision: PartRevision;
  Query: {};
  SceneViewItem: SceneViewItem;
  Transform: Transform;
  Vector3: Vector3;
  Vector3Input: Vector3Input;
}>;

export type ColorMaterialResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ColorMaterial'] = ResolversParentTypes['ColorMaterial']> = ResolversObject<{
  opacity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  glossiness?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  diffuse?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ambient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specular?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emissive?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  save?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveArgs, 'enabled' | 'sceneViewId'>>;
}>;

export type PartResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Part'] = ResolversParentTypes['Part']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  suppliedId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PartRevisionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PartRevision'] = ResolversParentTypes['PartRevision']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  partId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  suppliedId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  sceneViewItem?: Resolver<Maybe<ResolversTypes['SceneViewItem']>, ParentType, ContextType, RequireFields<QuerySceneViewItemArgs, 'sceneViewId' | 'itemId'>>;
  partRevision?: Resolver<Maybe<ResolversTypes['PartRevision']>, ParentType, ContextType, RequireFields<QueryPartRevisionArgs, 'revisionId'>>;
  part?: Resolver<Maybe<ResolversTypes['Part']>, ParentType, ContextType, RequireFields<QueryPartArgs, 'partId'>>;
}>;

export type SceneViewItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SceneViewItem'] = ResolversParentTypes['SceneViewItem']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  suppliedId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  visible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  selected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  transform?: Resolver<ResolversTypes['Transform'], ParentType, ContextType>;
  materialOverride?: Resolver<Maybe<ResolversTypes['ColorMaterial']>, ParentType, ContextType>;
  worldTransform?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType, RequireFields<SceneViewItemWorldTransformArgs, 'sceneViewId' | 'itemId'>>;
  partRevisionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransformResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Transform'] = ResolversParentTypes['Transform']> = ResolversObject<{
  position?: Resolver<ResolversTypes['Vector3'], ParentType, ContextType>;
  rotation?: Resolver<ResolversTypes['Vector3'], ParentType, ContextType>;
  scale?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Vector3Resolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Vector3'] = ResolversParentTypes['Vector3']> = ResolversObject<{
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  z?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  ColorMaterial?: ColorMaterialResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Part?: PartResolvers<ContextType>;
  PartRevision?: PartRevisionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SceneViewItem?: SceneViewItemResolvers<ContextType>;
  Transform?: TransformResolvers<ContextType>;
  Vector3?: Vector3Resolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>;
