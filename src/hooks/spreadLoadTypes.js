export const useSpreadLoadTypes = ({
  types,
  loadTypes,
  categories,
  joinTextCount = 5,
  loadTypesCategories,
}) => {
  const selectedCategories = [];
  const selectedTypes = [];

  loadTypesCategories?.map((c) => categories?.includes(c?.id) && selectedCategories?.push(c));
  loadTypes?.map((t) => types?.includes(t?.id) && selectedTypes?.push(t));

  const categoriesJoin = selectedCategories?.length
    ? selectedCategories?.reduce(
        (text, c, idx) => (text += idx < joinTextCount ? `${idx !== 0 ? " / " : ""}${c?.ext}` : ""),
        ""
      )
    : "";

  const typesJoin =
    selectedTypes?.length && selectedCategories?.length < joinTextCount
      ? selectedTypes?.reduce(
          (text, t, idx) =>
            (text +=
              idx < joinTextCount - selectedCategories?.length
                ? `${idx !== 0 || selectedCategories?.length ? " / " : ""}${t?.ext}`
                : ""),
          ""
        )
      : "";

  return {
    categories: selectedCategories,
    types: selectedTypes,
    selectedCount: selectedCategories?.length + selectedTypes?.length,
    value: (categoriesJoin || typesJoin) && (
      <span>
        <span className="font-bold">{categoriesJoin} </span>
        <span>{typesJoin}</span>
      </span>
    ),
    joinTextCount,
  };
};
