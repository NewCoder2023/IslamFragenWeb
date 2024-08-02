import { useState, useEffect } from "react";
import useFetchSubCategories from "components/useFetchSubCategories";

interface Item {
  id: number;
  title: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
  question: string;
  tableName: string; // Add tableName to store the category name
}

const useSearchItems = (search: string) => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { subCategories } = useFetchSubCategories();



  useEffect(() => {
    const fetchData = async () => {
      if (!subCategories) {
        setFetchError("Failed to fetch subcategories");
        setIsLoading(false);
        return;
      }

      try {
        let flatQuestions: Item[] = [];

        // Flatten the questions into a single array and include tableName
        subCategories.forEach((category: any) => {
          category.questions.forEach((question: any, index: any) => {
            if (question && question.question && question.title) {
              flatQuestions.push({
                ...question,
                tableName: category.tableName, 
                id: `${category.tableName}-${index}`, 
              });
            } else {
              console.error("Invalid question format", question);
            }
          });
        });

        const normalizedSearch = search.toLowerCase();

        // Filter results based on the search term similarity to the question and title
        const filteredResults = flatQuestions.filter((item: Item) => {
          return (
            item.question.toLowerCase().includes(normalizedSearch) ||
            item.title.toLowerCase().includes(normalizedSearch)
          );
        });

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error processing subcategories:", error);
        setFetchError("Error processing subcategories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subCategories, search]); // Add 'search' as a dependency

  return {
    searchResults,
    fetchError,
    isLoading,
  };
};

export default useSearchItems;
