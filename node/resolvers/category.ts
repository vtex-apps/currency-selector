export const Category = {
  locale: (
    _root: ResolvedPromise<CategoryTranslationResponse>,
    _args: unknown,
    ctx: Context
  ) => {
    return ctx.state.locale
  },
  name: (root: ResolvedPromise<CategoryTranslationResponse>) =>
    root.data.category.name,
  title: (root: ResolvedPromise<CategoryTranslationResponse>) =>
    root.data.category.title,
  description: (root: ResolvedPromise<CategoryTranslationResponse>) =>
    root.data.category.description,
  id: (root: ResolvedPromise<CategoryTranslationResponse>) =>
    root.data.category.id,
  linkId: (root: ResolvedPromise<CategoryTranslationResponse>) =>
    root.data.category.linkId,
}

const salesChannel = async (
  _root: unknown,
  args: { locale: string; active?: boolean },
  ctx: Context
) => {
  const {
    clients: { catalogGQL },
  } = ctx

  // const salesChannel =
  await catalogGQL.getSalesChannel(ctx)

  // console.log(`catalogGQL`,salesChannel)
  const { active, locale } = args

  if (active && locale) {
    // console.log(` active, locale`, active, locale)
  }

  return []
}

export const queries = {
  salesChannel,
}
