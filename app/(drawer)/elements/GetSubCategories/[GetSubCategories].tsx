import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import RenderSubCategories from "components/RenderSubCategories";
import { Stack } from "expo-router";
import useFetchSubCategories from "components/useFetchSubCategories";
import { Loading } from "components/Loading";

export default function GetSubCategories() {
  const { subCategory } = useLocalSearchParams<{ subCategory: string }>();
  const { SubCategoriesError, subCategories, refetch, isFetchingSub } =
    useFetchSubCategories();

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  if (isFetchingSub) {
    return <Loading message="Fragen werden geladen!" />;
  }

  // Determine matched table and filtered items based on subCategory
  const matchedTable = subCategories?.find(
    (table) => table.tableName === subCategory
  );
  const filteredItems = matchedTable ? matchedTable.questions : [];


  return (
    <View style={styles.container}>
      {!subCategory ? (
        <RenderSubCategories
          items={[]}
          fetchError={SubCategoriesError}
          table=''
          isFetching={isFetchingSub}
        />
      ) : (
        <>
          <Stack.Screen options={{ headerTitle: subCategory }} />
          <RenderSubCategories
            items={filteredItems}
            fetchError={SubCategoriesError}
            table={encodeTable(subCategory)}
            isFetching={isFetchingSub}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
